function loadAllCustomer() {
    $("#customerTable").empty();
    for (let i = 0; i < customerDB.length; i++) {
        let customerID = customerDB[i].getID();
        let customerName =customerDB[i].getName();
        let customerAddress = customerDB[i].getAddress();
        let Contact = customerDB[i].getContact();

        let row =`<tr><td>${customerID}</td><td>${customerName}</td><td>${customerAddress}</td><td>${Contact}</td></tr>`;
        $("#customerTable").append(row);
    }
}


