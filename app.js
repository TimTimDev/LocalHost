let teacherList = document.getElementById('teacherList');
let roomList = document.getElementById('roomList');
let groupList = document.getElementById('groupList');
let searchBar = document.getElementById('searchBar');

let teachers;
let groups;
let rooms;
let weeks;
//filtered = teachers.filter(item=> (item.firstname) + item.lastname).toLowerCase().includes(value.replace(/\s/g,'').LowerCase)
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

function timeTableQuery(object, index, day) {
    console.log("works");
    fetch('https://be.ta19heinsoo.itmajakas.ee/api/'+ object + index)
        .then(response => response.json())
        .then(data =>
            data.timetableEvents.forEach(function(item){
                //finding the day of the item
                let date = new Date(item.date);

                if (date.getDay() == day) {
                    document.write(item.timeStart + ' - ' + item.timeEnd);
                    document.write(' ');
                    if (item.rooms != null && item.teachers != null && item.nameEt != null) {
                        document.write(item.rooms[0].roomCode);
                        document.write(' ');
                        item.teachers.forEach(function(item, index){
                        document.write(item.name + ' ');
                    })
                    document.write(' ');
                    document.write(item.nameEt);
                }
                document.write('<br>');
                }
            })
            )
}

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
        teacherList.innerHTML = "";
        roomList.innerHTML = "";
        groupList.innerHTML = "";

        let options = {
            keys: ['firstname', 'lastname']
        }
        let fuse = new Fuse(teachers, options)
        let result = fuse.search(object)
        result.forEach(function(item){
            teacherList.innerHTML += `
                <li>
                    <button onclick='timeTableQuery("lessons/teachers=${item.item.teacherId}&weeks=",${week}, ${day})'>
                        ${item.item.firstname} ${item.item.lastname}
                    </button>
                </li>`;
        })

        options = {
            keys: ['code']
        }
        fuse = new Fuse(rooms, options)
        result = fuse.search(object)
        result.forEach(function(item){
            roomList.innerHTML += `
                <li>
                    <button onclick='timeTableQuery("lessons/teachers=${item.item.roomId}&weeks=",${week}, ${day})'>
                        ${item.item.code}
                    </button>
                </li>`;
        })

        options = {
            keys: ['groupCode']
        }
        fuse = new Fuse(groups, options)
        result = fuse.search(object)
        result.forEach(function(item){
            groupList.innerHTML += `
                <li>
                    <button onclick='timeTableQuery("lessons/teachers=${item.item.groupId}&weeks=",${week}, ${day})'>
                        ${item.item.groupCode}
                    </button>
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
