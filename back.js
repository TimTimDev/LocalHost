let resultList = document.getElementById('resultList');
let searchBar = document.getElementById('searchBar');
let monday = document.getElementById("monday");
let tuesday = document.getElementById("tuesday");
let wednesday = document.getElementById("wednesday");
let thursday = document.getElementById("thursday");
let friday = document.getElementById("friday");
const closeSearch = document.querySelector('.search-link');

let teachers;
let groups;
let rooms;
let weeks;

(async () => {
    let response = await fetch('https://be.ta19heinsoo.itmajakas.ee/api/teachers');
    teachers = await response.json();
    let response2 = await fetch('https://be.ta19heinsoo.itmajakas.ee/api/rooms');
    rooms = await response2.json();
    let response3 = await fetch('https://be.ta19heinsoo.itmajakas.ee/api/groups');
    groups = await response3.json();
    let response4 = await fetch('https://be.ta19heinsoo.itmajakas.ee/api/weeks');
    weeks = await response4.json();
})()

function timeTableQuery(object, index) {
    monday.innerHTML = "<p class='what-day-is'>Esmaspäev</p>";
    tuesday.innerHTML = "<p class='what-day-is'>Teisipäev</p>";
    wednesday.innerHTML = "<p class='what-day-is'>Kolmapäev</p>";
    thursday.innerHTML = "<p class='what-day-is'>Neljapäev</p>";
    friday.innerHTML = "<p class='what-day-is'>Reede</p>";
    fetch('https://be.ta19heinsoo.itmajakas.ee/api/lessons/'+ object + '&weeks=' + index)
        .then(response => response.json())
        .then(data =>
            data.timetableEvents.forEach(function(item){
                let day = new Date(item.date);
                day = day.getDay();
                if (item.rooms != null) {
                    if (day == 1) {
                        monday.innerHTML += `
                            <div class="panel">
                                <div id="tnp">
                                    <span class="lesson-time">${item.timeStart} - ${item.timeEnd}</span>
                                    <span class="lesson-class">${item.rooms[0].roomCode}</span>
                                </div>
                                <span class="lesson-card-content">${item.teachers[0].name}</span>
                                <span class="lesson-card-content">${item.nameEt}</span>
                            </div>
                        `;
                    } 
                    if (day == 2) {
                        tuesday.innerHTML += `
                            <div class="panel">
                                <div id="tnp">
                                    <span class="lesson-time">${item.timeStart} - ${item.timeEnd}</span>
                                    <span class="lesson-class">${item.rooms[0].roomCode}</span>
                                </div>
                                <span class="lesson-card-content">${item.teachers[0].name}</span>
                                <span class="lesson-card-content">${item.nameEt}</span>
                            </div>
                        `;
                    } 
                    if (day == 3) {
                        wednesday.innerHTML += `
                            <div class="panel">
                                <div id="tnp">
                                    <span class="lesson-time">${item.timeStart} - ${item.timeEnd}</span>
                                    <span class="lesson-class">${item.rooms[0].roomCode}</span>
                                </div>
                                <span class="lesson-card-content">${item.teachers[0].name}</span>
                                <span class="lesson-card-content">${item.nameEt}</span>
                            </div>
                        `;
                    } 
                    if (day == 4) {
                        thursday.innerHTML += `
                            <div class="panel">
                                <div id="tnp">
                                    <span class="lesson-time">${item.timeStart} - ${item.timeEnd}</span>
                                    <span class="lesson-class">${item.rooms[0].roomCode}</span>
                                </div>
                                <span class="lesson-card-content">${item.teachers[0].name}</span>
                                <span class="lesson-card-content">${item.nameEt}</span>
                            </div>
                        `;
                    } 
                    if (day == 5) {
                        friday.innerHTML += `
                            <div class="panel">
                                <div id="tnp">
                                    <span class="lesson-time">${item.timeStart} - ${item.timeEnd}</span>
                                    <span class="lesson-class">${item.rooms[0].roomCode}</span>
                                </div>
                                <span class="lesson-card-content">${item.teachers[0].name}</span>
                                <span class="lesson-card-content">${item.nameEt}</span>
                            </div>
                        `;
                    } 
                }
                openSearchModal.style.display = 'none'
            })
            )
}

timeTableQuery("rooms=4356", 9);

setTimeout(() => {

    function findWeek(){
        let today = Date.parse(new Date());
        let result;
        weeks.forEach(function(item) {
            if (Date.parse(item.start) < today && Date.parse(item.end) > today) {
                result = item.weekNr;
            }
        })

        return result;
    }

    

    function findResults(object, week, day) {
        resultList.innerHTML = "";

        let options = {
            keys: ['firstname', 'lastname']
        }
        let fuse = new Fuse(teachers, options)
        let result = fuse.search(object)
        result.forEach(function(item){
            resultList.innerHTML += `
                <li>
                    <a class="search-link" onclick='timeTableQuery("teachers=${item.item.teacherId}",${week})'>
                        ${item.item.firstname} ${item.item.lastname}
                    </a>
                </li>`;
        })

        options = {
            keys: ['code']
        }
        fuse = new Fuse(rooms, options)
        result = fuse.search(object)
        result.forEach(function(item){
            resultList.innerHTML += `
                <li>
                    <a class="search-link" onclick='timeTableQuery("rooms=${item.item.roomId}",${week})'>
                        ${item.item.code}
                    </a>
                </li>`;
        })

        options = {
            keys: ['groupCode']
        }
        fuse = new Fuse(groups, options)
        result = fuse.search(object)
        result.forEach(function(item){
            resultList.innerHTML += `
                <li>
                    <a class="search-link" onclick='timeTableQuery("groups=${item.item.groupId}",${week})'>
                        ${item.item.groupCode}
                    </a>
                </li>`;
        });
    
    }

    let currentWeek = findWeek();
    let today = new Date();
    let weekDay = today.getDay();

    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value;
        findResults(searchString, currentWeek, weekDay);
    });

}, 2000);