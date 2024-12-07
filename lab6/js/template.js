// Инициализация базы данных
let db;

let openRequest = indexedDB.open("clinicDB", 1);

openRequest.onupgradeneeded = function(event){
    db = event.target.result;

    if (!db.objectStoreNames.contains("patients")) {
        // Создаём хранилище объектов с ключом `id`, который будет автоматически увеличиваться
        db.createObjectStore("patients", { keyPath: "id", autoIncrement: true });
  }
}

// если откртие бд успешно
openRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("База данных открыта:", db);
    updatePatientTable(); 
    updatePatientSelect();
};

// если ошибка
openRequest.onerror = function(event) {
    console.error("Ошибка открытия базы данных:", event.target.error);
};

// добавление инфы о пациентах
function addPatient(patient) {
    const transaction = db.transaction("patients", "readwrite");
    const store = transaction.objectStore("patients");

    const request = store.add(patient);

    request.onsuccess = function() {
        console.log("Пациент добавлен:", patient);
        updatePatientTable();  // Обновить таблицу после добавления
    };

    request.onerror = function() {
        console.error("Ошибка добавления клиента:", request.error);
    };
}

class Patient {
    constructor(fio, address, phone, stationary) {
        this.fio = fio;
        this.address = address;
        this.phone = phone;
        this.stationary = stationary;
    }

    // Метод для сохранения пациента в IndexedDB
    saveToDatabase() {
        addPatient(this);  // Добавляем пациента через функцию
    }

    // Статический метод для получения всех пациентов
    static getAllPatients(callback) {
        const transaction = db.transaction("patients", "readonly");
        const store = transaction.objectStore("patients");

        const request = store.getAll();
        request.onsuccess = () => callback(request.result);
        request.onerror = (event) => console.error("Ошибка при получении пациентов:", event.target.error);
    }

    // Статический метод для удаления пациента
    static deletePatient(id, callback) {
        const transaction = db.transaction("patients", "readwrite");
        const store = transaction.objectStore("patients");

        const request = store.delete(id);
        request.onsuccess = () => {
            console.log(`Пациент с ID ${id} удалён.`);
            callback(); // Обновить таблицу после удаления
        };
        request.onerror = (event) => console.error("Ошибка при удалении пациента:", event.target.error);
    }

}

// Обработчик отправки формы
document.getElementById("patientForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const fio = document.getElementById("fio").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const stationary = document.getElementById("stationary").checked ? "Да" : "Нет";

    const patient = new Patient(fio, address, phone, stationary);

    const additionalFields = document.getElementById("newPropertyValue").querySelectorAll("input");
    additionalFields.forEach((field) => {
        patient[field.name] = field.value;
    });

    patient.saveToDatabase();

    this.reset();
});

// Функция для обновления таблицы пациентов
function updatePatientTable() {
    const patientTableBody = document.getElementById("patientTable").querySelector("tbody");
    patientTableBody.innerHTML = "";

    Patient.getAllPatients((patients) => {
        patients.forEach((p) => {
            const row = document.createElement("tr");

            let dynamicProperties = "";
            for (const key in p) {
                if (key !== "id" && key !== "fio" && key !== "address" && key !== "phone" && key !== "stationary") {
                    dynamicProperties += `<td>${p[key]}</td>`;
                }
            }

            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.fio}</td>
                <td>${p.address}</td>
                <td>${p.phone}</td>
                <td>${p.stationary}</td>
                ${dynamicProperties}
            `;

            patientTableBody.appendChild(row);
        });
    });
}


// обновление выпадающего списка с ID пациентов
function updatePatientSelect() {
    const patientSelect = document.getElementById("patientId");
    patientSelect.innerHTML = `<option value="">Выберите пациента</option>`;

    Patient.getAllPatients((patients) => {
        patients.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = `${p.id}, ${p.fio}`;
            patientSelect.appendChild(option);
        });
    });
}


// Добавление обработчика для кнопки "Удалить"
document.getElementById("deletePatient").addEventListener("click", function() {
    const patientId = document.getElementById("patientId").value;
    if (patientId) {
        deletePatient(Number(patientId));
    } else {
        alert("Выберите пациента для удаления");
    }
});


// Функция для удаления пациента
function deletePatient(id) {
    Patient.deletePatient(id, () => {
        updatePatientTable();  
        updatePatientSelect(); 
    });
}

// очистка фор
document.getElementById("resetBtn").addEventListener("click", function() {
    // Очистка формы
    document.getElementById("patientForm").reset();
});

document.getElementById("showStationaryPatients").addEventListener("click", function () {
    // document.getElementById("patientTable").style.visibility = "visible";
    const patientTableBody = document.getElementById("patientTable").querySelector("tbody");
    patientTableBody.innerHTML = ""; 

    Patient.getAllPatients((patients) => {
        const stationaryPatients = patients.filter((p) => p.stationary === "Да");

        stationaryPatients.forEach((p) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.fio}</td>
                <td>${p.address}</td>
                <td>${p.phone}</td>
                <td>${p.stationary}</td>
            `;

            patientTableBody.appendChild(row);
        });

        if (stationaryPatients.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="5">Стационарные пациенты отсутствуют.</td>`;
            patientTableBody.appendChild(row);
        }
    });
});


document.getElementById("showAllPatients").addEventListener("click", function() {
    // document.getElementById("patientTable").style.visibility = "visible";
    updatePatientTable();
});


function addNewPropertyToPatients(propertyName, propertyValue) {
    Patient.getAllPatients((patients) => {
        const transaction = db.transaction("patients", "readwrite");
        const store = transaction.objectStore("patients");

        patients.forEach((p) => {
            p[propertyName] = propertyValue; // новое свойство
            store.put(p); // запись в базе данных
        });

        updatePatientTable();
    });
}

// массив для хранения новых свойств
let additionalProperties = [];

document.getElementById("addProperty").addEventListener("click", () => {
    const fieldDiv = document.getElementById("newPropertyValue");
    
    const propertyName = prompt("Введите название нового свойства:");
    if (!propertyName) {
        alert("Название свойства не может быть пустым!");
        return;
    }

    if (additionalProperties.includes(propertyName)) {
        alert("Это свойство уже добавлено!");
        return;
    }

    // в массив
    additionalProperties.push(propertyName);

    // новый label и input
    const label = document.createElement("label");
    label.textContent = propertyName + ": ";
    label.setAttribute("for", propertyName);

    const input = document.createElement("input");
    input.type = "text";
    input.id = propertyName;
    input.name = propertyName;

    //новые элементы в див
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    fieldDiv.appendChild(document.createElement("br"));

    updateTableHeaders();
});


function updateTableHeaders() {
    const tableHead = document.getElementById("patientTable").querySelector("thead");
    tableHead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Стационар</th>
            ${additionalProperties.map((prop) => `<th>${prop}</th>`).join("")}
        </tr>
    `;
}