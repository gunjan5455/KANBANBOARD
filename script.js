const addBtn = document.querySelector(".add-cont");
const model = document.querySelector(".model_cont");
const prioritycolor = document.querySelectorAll(".priority_color")
const textarea = document.querySelector(".textarea_cont");
const defalutcolor = document.querySelector(".priority_color_cont .pink");
const pendingcont = document.querySelector(".pending_cont");
const hedercolor = document.querySelectorAll(".colors");
const dele = document.querySelector(".fa-trash");
const star = document.querySelector(".fa-star");
const colors = ["pink", "blue", "purple", "green"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

loadExistingTicketsOnUI();
function loadExistingTicketsOnUI() {
    const existingTickets = fetchExistingCard();

    //display
    displayTickets(existingTickets);
}
function displayTickets(tickets) {


    for (let i = 0; i < tickets.length; i++) {

        const ticket = tickets[i];
        const { color, content, id, wmonth, wday } = ticket;

        createticket(color, content, id, wmonth, wday, false);

    }

}
addBtn.addEventListener("click", () => {
    model.style.display = "flex";
})

function removeactive() {
    for (let i = 0; i < prioritycolor.length; i++) {
        prioritycolor[i].classList.remove("active");
    }
}
for (let i = 0; i < prioritycolor.length; i++) {
    const priorityele = prioritycolor[i];
    priorityele.addEventListener("click", (e) => {
        removeactive();
        // console.log(e.target);
        e.target.classList.add("active");
    })
}

model.addEventListener("keypress", (e) => {

    const key = e.key;
    if (key != "Enter") {
        return;
    }

    const activecolor = findactive();
    const valoftextarea = findtext();
    const ticketId = cardID();
    const mon = currentMonth();
    const dayy = currentDate();
    createticket(activecolor, valoftextarea, ticketId, mon, dayy, true);
    textarea.value = "";
    removeactive();
    defalutcolor.classList.add("active");
    // console.log(defalutcolor);
    // console.log(activecolor);
    // console.log(valoftextarea);
    // createticket();
    model.style.display = "none";

})
function findactive() {
    for (let i = 0; i < prioritycolor.length; i++) {

        const acolor = prioritycolor[i];
        if (acolor.classList.contains("active")) {
            return acolor.classList[1];
        }

    }
}
function findtext() {
    return textarea.value;
}

function createticket(color, value, ticketId, mon, dayy, addToLocalStorage) {
    const ticketcreate = document.createElement("div");
    ticketcreate.setAttribute("class", "card");
    ticketcreate.innerHTML = `
        <div class="card-colors ${color}"></div>
            <div class="content-box">   
                <span class="ticket-id">${ticketId}</span>
                <p class="card-content" contenteditable="false">
                    ${value} 
                </p>
                <div class="lock_unlock">
                     <i class="fa fa-lock"></i>
                </div>
            </div>
                <div class="date-box">
                    <span class="month">${mon}</span>
                    <span class="date">${dayy}</span>
                </div>
    `;
    const lockunlock = ticketcreate.querySelector(".lock_unlock");
    const contentcard = ticketcreate.querySelector(".card-content");
    const prio_color = ticketcreate.querySelector(".card-colors");

    lockunlock.addEventListener("click", (e) => lockunlockhemdler(e, contentcard));
    ticketcreate.addEventListener("click", handlecardclick);
    prio_color.addEventListener("click", handlepriority);




    pendingcont.appendChild(ticketcreate);

    if (addToLocalStorage) {
        const newCard = {
            id: ticketId,
            color: color,
            content: value,
            wmonth: mon,
            wday: dayy
        }
        addExistingtoLocalStorage(newCard);
    }
}

function addExistingtoLocalStorage(newCard) {
    const existingCard = fetchExistingCard();
    existingCard.push(newCard);
    saveCard(existingCard);

}
function fetchExistingCard() {
    const existingCard = localStorage.getItem("kanbanCard");
    const existingCardJS = JSON.parse(existingCard);
    if (existingCardJS == null) {
        return [];
    }
    return existingCardJS;

}
function saveCard(newCard) {
    const newCardJSON = JSON.stringify(newCard);
    localStorage.setItem("kanbanCard", newCardJSON);
}
function handlepriority(e) {
    if (star.classList.contains("red")) {
        console.log(e.currentTarget);
        const existcolor = e.currentTarget.classList[1];
        const ccolorindex = colors.indexOf(existcolor);


        const newColorIndex = (ccolorindex + 1) % colors.length;
        const newColor = colors[newColorIndex];


        e.currentTarget.classList.remove(existcolor);
        e.currentTarget.classList.add(newColor);

        let existingCardJS = fetchExistingCard();
        let parentClass = e.currentTarget.closest(".card");
        let forCmprTicketid = parentClass.querySelector(".ticket-id").textContent;
        let index = existingCardJS.findIndex(tic => tic.id === forCmprTicketid);
        if (index !== -1) {
            existingCardJS[index].color = newColor;
            localStorage.setItem('kanbanCard', JSON.stringify(existingCardJS));
        } else {
            console.error(`No card found with ID: ${forCmprTicketid}`);
        }
    }
}

function handlecardclick(e) {
    if (dele.classList.contains("red")) {

        e.currentTarget.remove();
        console.log(e.currentTarget);
        let forCmprTicketid = e.currentTarget.querySelector(".ticket-id").textContent;
        console.log(forCmprTicketid);
        let existingCardJS = fetchExistingCard();
        let index = existingCardJS.findIndex(tic => tic.id === forCmprTicketid);
        if (index !== -1) {
            existingCardJS.splice(index, 1);
            localStorage.setItem('kanbanCard', JSON.stringify(existingCardJS));

        }

    }
}
function lockunlockhemdler(e, contentcard) {
    console.log(e.target);
    const isloked = e.target.classList.contains("fa-lock");

    if (isloked) {
        e.target.classList.remove("fa-lock");
        e.target.classList.add("fa-unlock");
        contentcard.setAttribute("contenteditable", "true");

    } else {
        e.target.classList.add("fa-lock");
        e.target.classList.remove("fa-unlock");
        contentcard.setAttribute("contenteditable", "false");
        let conText = contentcard.textContent;
        console.log(conText);
        let existingCardJS = fetchExistingCard();
        let parentClass = e.currentTarget.closest(".content-box");
        let forCmprTicketid = parentClass.querySelector(".ticket-id").textContent;
        let index = existingCardJS.findIndex(tic => tic.id === forCmprTicketid);
        if (index !== -1) {
            existingCardJS[index].content = conText;
            localStorage.setItem('kanbanCard', JSON.stringify(existingCardJS));
        } else {
            console.error(`No card found with ID: ${forCmprTicketid}`);
        }
    }


}
function cardID() {
    const uid = new ShortUniqueId({ length: 7 });
    const ticketId = uid.rnd();
    return ticketId;
}
function currentMonth() {
    const d = new Date();
    let name = month[d.getMonth()];
    return name;
}
function currentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    return day;
}
for (let i = 0; i < hedercolor.length; i++) {
    const hedercolors = hedercolor[i];
    hedercolors.addEventListener("click", (e) => {
        const cardcolor = e.target.classList[1];
        const allcards = document.querySelectorAll(".card");
        for (let i = 0; i < allcards.length; i++) {
            const ticketContainer = allcards[i];
            const ticketColorElement = ticketContainer.querySelector(".card-colors");
            const ticketColor = ticketColorElement.classList[1];
            if (ticketColor !== cardcolor) {
                ticketContainer.style.display = "none";
            } else {
                ticketContainer.style.display = "block";
            }
        }
    })
    hedercolors.addEventListener("dblclick", (e) => {
        console.log("dblclicked", e.target);
        const allcards = document.querySelectorAll(".card");
        for (let i = 0; i < allcards.length; i++) {
            const ticketContainer = allcards[i];
            ticketContainer.style.display = "block";
        }
    })
}

dele.addEventListener("click", () => {
    if (dele.classList.contains("red")) {
        dele.classList.remove("red");
        alert("Delete is Deactiveted, Now you can't delete it.");
    } else {
        dele.classList.add("red");
        alert("Delete is activeted, Now you can delete card by clicking on it.");
        handlecardclick();
    }
})

star.addEventListener("click", () => {
    if (star.classList.contains("red")) {
        star.classList.remove("red");
        alert("Priority star is Deactiveted, Now you can't change it.");
    } else {
        star.classList.add("red");
        alert("Priority star is activeted, Now you can change priority of card by clicking on it's color.");
        handlepriority();
    }
})
