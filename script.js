document.addEventListener("DOMContentLoaded", () => {
    const entrySection = document.getElementById("entry-section");
    const feeSection = document.getElementById("fee-section");
    const entryBtn = document.getElementById("entry-btn");
    const feeBtn = document.getElementById("fee-btn");

    const entryForm = document.getElementById("entry-form");
    const feeForm = document.getElementById("fee-form");

    const entryList = document.getElementById("entry-list");
    const feeList = document.getElementById("fee-list");

    const exportEntriesBtn = document.getElementById("export-entries");
    const exportFeesBtn = document.getElementById("export-fees");

    const deleteAllEntriesBtn = document.getElementById("delete-all-entries");
    const deleteAllFeesBtn = document.getElementById("delete-all-fees");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    let fees = JSON.parse(localStorage.getItem("fees")) || [];

    const saveEntries = () => localStorage.setItem("entries", JSON.stringify(entries));
    const saveFees = () => localStorage.setItem("fees", JSON.stringify(fees));

    const renderEntries = () => {
        entryList.innerHTML = "";
        entries.forEach((entry, index) => {
            const li = document.createElement("li");

            const nameSpan = document.createElement("span");
            nameSpan.textContent = entry.name;
            nameSpan.style.marginRight = "15px";

            const dateSpan = document.createElement("span");
            dateSpan.textContent = entry.date;
            dateSpan.style.marginRight = "15px";

            const timeSpan = document.createElement("span");
            timeSpan.textContent = entry.time;
            timeSpan.style.marginRight = "15px";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.fontSize = "3vw";

            deleteBtn.addEventListener("click", () => {
                entries.splice(index, 1);
                saveEntries();
                renderEntries();
            });

            li.appendChild(nameSpan);
            li.appendChild(dateSpan);
            li.appendChild(timeSpan);
            li.appendChild(deleteBtn);
            entryList.appendChild(li);
        });
    };

    const renderFees = () => {
        feeList.innerHTML = "";
        fees.forEach((fee, index) => {
            const li = document.createElement("li");

            const nameSpan = document.createElement("span");
            nameSpan.textContent = fee.name;
            nameSpan.style.marginRight = "15px";

            const amountSpan = document.createElement("span");
            amountSpan.textContent = `₹${fee.amount}`;
            amountSpan.style.marginRight = "15px";

            const dateSpan = document.createElement("span");
            dateSpan.textContent = fee.date;
            dateSpan.style.marginRight = "15px";

            const timeSpan = document.createElement("span");
            timeSpan.textContent = fee.time;
            timeSpan.style.marginRight = "15px";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.fontSize = "3vw";
            deleteBtn.addEventListener("click", () => {
                fees.splice(index, 1);
                saveFees();
                renderFees();
            });

            li.appendChild(nameSpan);
            li.appendChild(amountSpan);
            li.appendChild(dateSpan);
            li.appendChild(timeSpan);
            li.appendChild(deleteBtn);
            feeList.appendChild(li);
        });
    };

    entryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("entry-name").value;
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
        entries.push({ name, date, day, time });
        saveEntries();
        renderEntries();
        entryForm.reset();
    });

    feeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("fee-name").value;
        const amount = parseFloat(document.getElementById("fee-amount").value);
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
        fees.push({ name, amount, date, day, time });
        saveFees();
        renderFees();
        feeForm.reset();
    });

    exportEntriesBtn.addEventListener("click", () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData = [["Name", "Day", "Date", "Time"], ...entries.map(entry => [entry.name, entry.day, entry.date, entry.time])];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
        XLSX.writeFile(workbook, "entries.xlsx");
    });

    exportFeesBtn.addEventListener("click", () => {
        const workbook = XLSX.utils.book_new();
        const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const worksheetData = [["Name", "Amount", "Day", "Date", "Time"], ...fees.map(fee => [fee.name, fee.amount, fee.day, fee.date, fee.time]), ["", "Total", totalAmount]];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");
        XLSX.writeFile(workbook, "fees.xlsx");
    });

    entryBtn.addEventListener("click", () => {
        entrySection.classList.remove("hidden");
        feeSection.classList.add("hidden");
    });

    feeBtn.addEventListener("click", () => {
        feeSection.classList.remove("hidden");
        entrySection.classList.add("hidden");
    });

    deleteAllEntriesBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all entries?")) {
            entries = [];
            saveEntries();
            renderEntries();
        }
    });

    deleteAllFeesBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all fee records?")) {
            fees = [];
            saveFees();
            renderFees();
        }
    });

    renderEntries();
    renderFees();
});
