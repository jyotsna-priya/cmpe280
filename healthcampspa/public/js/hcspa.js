var db = null;
var imgURL;
var compressedURL;
var latest_id;

const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
    
var has_camera_permission = false; //no camera permission at page_load

const constraints = {
    video: true,
};

captureButton.addEventListener('click', () => {
    // Attach the video stream to the video element and autoplay.
    if(!has_camera_permission){
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
            has_camera_permission = true;
            player.srcObject = stream;
            });
    }
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);

    imgURL = canvas.toDataURL("image/png");
    $('#photo').attr('src', imgURL);
    // imgURL = canvas.toDataURL()
    // alert(imgURL)
});

connectToLocalDB = function()
{
    db = openDatabase('health_camp_spa','1.0','hcspa1',3*1024*1024);
    // alert("db opened")
};

createLocalTable = function()
{
    db.transaction(function(tx) {
        tx.executeSql(
        "CREATE TABLE IF NOT EXISTS hcspa_table (FirstName TEXT, LastName TEXT, Age INTEGER, Gender TEXT, Notes TEXT, Photo LONGTEXT, \
            Medications TEXT, MedicNotes TEXT, Height INTEGER, Weight INTEGER, Temperature INTEGER, Pulse INTEGER, BloodPressure TEXT)",
            [],
        );
  });
};

insertTable = function() {
    if (isOnline() == false) {
        connectToLocalDB();
        createLocalTable();
        insertTableLocal();
    }
    else {
        syncLocalWithServer();
        insertTableServer();
    }
};

updateTable = function() {
    if (isOnline() == false) {
        updateTableLocal();
    }
    else {
        updateTableServer();
    }
};

fetchData = function() {
    if (isOnline() == false) {
        fetchDataLocal();
    }
    else {
        fetchDataServer();
    }
};

function syncLocalWithServer() {
    connectToLocalDB();
    db.transaction(function(tr) {
        tr.executeSql("SELECT * FROM hcspa_table", [],
        function(trans, data) {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    var row = data.rows.item(i);
                    var FirstName = row['FirstName'];
                    var LastName = row['LastName'];
                    var Age = row['Age'];
                    var Gender = row['Gender'];
                    var Notes = row['Notes'];
                    var Medications = row['Medications'];
                    var MedicNotes = row['MedicNotes'];
                    var Height = row['Height'];
                    var Weight = row['Weight'];
                    var Temperature = row['Temperature'];
                    var Pulse = row['Pulse'];
                    var BloodPressure = row['BloodPressure'];
                    var img = row['Photo']
                    const url = "/SendLocalToServerAPI";
                    fetch(url, {
                        method : "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body : JSON.stringify({
                            fName : FirstName,
                            lName : LastName,
                            gender : Gender,
                            age : Age,
                            notes: Notes,
                            photo: img,
                            medications: Medications,
                            med_notes: MedicNotes,
                            height: Height,
                            weight: Weight,
                            BT: Temperature,
                            PR: Pulse,
                            BP: BloodPressure
                        })
                    })
                }
            }
        });
    });
    db.transaction( function(tr) {
        tr.executeSql('DELETE FROM hcspa_table;')
    });
}

function insertTableServer() {
    const url = "/DemographicsAPI";
        fetch(url, {
            method : "POST",
            headers: {
                "Content-type": "application/json",
            },
            body : JSON.stringify({
                fName : document.getElementById('fName').value,
                lName : document.getElementById('lName').value,
                gender : document.getElementById('gender').value,
                age : document.getElementById('age').value,
                notes: document.getElementById('notes').value,
                photo: imgURL
            })
        }).then(response => response.json())
            .then(function(response){
                latest_id = response.ID;
                console.log("Fetched id: ", latest_id);
                document.getElementById('nav-vitals-tab').click();
            }
        );
    // $.ajax({
    //     url: "/DemographicsAPI",
    //     type: "POST",
    //     data: JSON.stringify({
    //         fName:document.getElementById("fName").value,
    //         lName:document.getElementById("lName").value,
    //         age:document.getElementById("age").value,
    //         gender:document.getElementById("gender").value,
    //         notes:document.getElementById("notes").value,
    //         photo: imgURL
    //         // photo:document.getElementById("photo").attr("source")
    //     }),
    //     contentType: "application/json",
    // });

    // document.getElementById("fName").value="";
    // document.getElementById("lName").value="";
    // document.getElementById("age").value="";
    // document.getElementById("gender").value="";
    // document.getElementById("notes").value="";
}

function updateTableServer(){
    const url = "/HealthVitalsAPI";
        fetch(url, {
            method : "POST",
            headers: {
                "Content-type": "application/json",
            },
            body : JSON.stringify({
                medications: document.getElementById('medications').value,
                med_notes: document.getElementById('med_notes').value,
                height: document.getElementById("height").value,
                weight: document.getElementById("weight").value,
                BT: document.getElementById("BT").value,
                PR: document.getElementById("PR").value,
                BP: document.getElementById("BP").value,
                id: latest_id,
            })
        }).then(response => response.json())
            .then(function(){
                console.log("Patient updated");
                document.getElementById('nav-report-tab').click();
            }
        );
    // $.ajax({
    //     url: "/HealthVitalsAPI",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         height:document.getElementById("height").value,
    //         weight:document.getElementById("weight").value,
    //         temperature:document.getElementById("BT").value,
    //         pulse:document.getElementById("PR").value,
    //         bp:document.getElementById("BP").value,
    //         drnotes:document.getElementById("medications").value,
    //         medication:document.getElementById("med_notes").value,
    //         // rowid :localStorage.getItem('rowid')
    //     }),
        
    // });
    // document.getElementById("height").value="";
    // document.getElementById("weight").value="";
    // document.getElementById("BT").value="";
    // document.getElementById("PR").value="";
    // document.getElementById("BP").value="";
    // document.getElementById("medications").value="";
    // document.getElementById("med_notes").value="";

}

function fetchDataServer() {
    $.ajax({
    url: "/PrintReportAPI",
    type: "GET",
    success: function(result) {
        var res = JSON.parse(result);
        $("#patient_table").find("tbody").empty();
        for(i=0; i < res.length; i++){
            fName = res[i].FirstName;
            lName = res[i].LastName;
            Name = fName.concat(" ").concat(lName);
            Age = res[i].Age;
            Gender = res[i].Gender;
            img = res[i].Photo;
            Medications = res[i].Medications;
            MedicNotes = res[i].MedicNotes;
            $('#patient_table').append(`<tr><td>${Name}</td>
            <td>${Age}</td>
            <td>${Gender}</td>
            <td><img src=${img} style="width:30px; height:50px"></td>
            <td>${Medications}</td>
            <td>${MedicNotes}</td></tr>`);
        }
    }
    });

}

function isOnline() { 
    // alert("you are online!")
    return ( navigator.onLine ) 
};

insertDemoLocal = function(FirstName, LastName, Age, Gender, Notes, img) {
    localStorage.setItem('FirstName', FirstName);
    localStorage.setItem('LastName', LastName);
    localStorage.setItem('Age', Age);
    localStorage.setItem('Gender', Gender);
    localStorage.setItem('Notes', Notes);
    localStorage.setItem('Photo', img);
};
  
insertVitalsLocal = function(Medications, MedicNotes, Height, Weight, Temperature, Pulse, BloodPressure) {
    var FirstName = localStorage.getItem('FirstName');
    var LastName = localStorage.getItem('LastName');
    var Age = localStorage.getItem('Age');
    var Gender = localStorage.getItem('Gender');
    var Notes = localStorage.getItem('Notes')
    var img = localStorage.getItem('Photo');
    db.transaction(function(tx){
        tx.executeSql("INSERT INTO hcspa_table (FirstName, LastName, Age, Gender, Notes, Photo, \
            Medications, MedicNotes, Height, Weight, Temperature, Pulse, BloodPressure) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [FirstName, LastName, Age, Gender, Notes, img,
            Medications, MedicNotes, Height, Weight, Temperature, Pulse, BloodPressure],
        );
    });
};
  
fetchDataLocal = function() {
    $("#patient_table").find("tbody").empty();
    db.transaction(function(tr) {
        tr.executeSql("SELECT FirstName, LastName, Age, Gender, Photo, Medications, MedicNotes FROM hcspa_table", [],
        function(trans, data) {
            for (var i = 0; i < data.rows.length; i++) {
                var row = data.rows.item(i);
                var Name = row['FirstName'].concat(" ").concat(row['LastName']) ;
                var Age = row['Age'];
                var Gender = row['Gender'];
                var Medications = row['Medications'];
                var MedicNotes = row['MedicNotes'];
                var img = row['Photo']
                $('#patient_table').append(`<tr><td>${Name}</td>
                    <td>${Age}</td>
                    <td>${Gender}</td>
                    <td><img src=${img} style="width:30px; height:50px"></td>
                    <td>${Medications}</td>
                    <td>${MedicNotes}</td></tr>`);
            }
        });
    });
};
  
insertTableLocal = function() {
    var FirstName = $('#fName').val();
    var LastName = $('#lName').val();
    var Age = $('#age').val();
    var Gender = $('#gender').find(':selected').val();
    var Notes = $('#notes').val();
    var img = $('#photo').attr('src');
    insertDemoLocal(FirstName, LastName, Age, Gender, Notes, img);
}

updateTableLocal = function() {
    var Medications = $('#medications').val();
    var MedicNotes = $('#med_notes').val();
    var Height = $('#height').val();
    var Weight = $('#weight').val();
    var Temperature = $('#BT').val();
    var Pulse = $('#PR').val();
    var BloodPressure = $('#BP').val();
    insertVitalsLocal(Medications, MedicNotes, Height, Weight, Temperature, Pulse, BloodPressure);
}





