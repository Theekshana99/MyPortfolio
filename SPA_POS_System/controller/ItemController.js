var regExItemID = /^(I-)[0-9]{3,4}$/;

function loadAllItem() {

    $("#ItemTable").empty();
    for (let i = 0; i < itemDB.length; i++) {
        let itemID = itemDB[i].getItemCode();
        let itemName =itemDB[i].getItemName();
        let itemQty = itemDB[i].getItemQTY();
        let price = itemDB[i].getPrice();


        let row = `<tr><td>${itemID}</td><td>${itemName}</td><td>${itemQty}</td><td>${price}</td></tr>`;


        $("#ItemTable").append(row);    }

    $("#ItemTable>tr").click(function () {
        $("#itemId").val($(this).children(":eq(0)").text());
        $("#ItemName").val($(this).children(":eq(1)").text());
        $("#itemQty").val($(this).children(":eq(2)").text());
        $("#unitPrice").val($(this).children(":eq(3)").text());
    });
}

$("#addItem").click(function ( ){
    saveItem();
    loadAllItem();
loadItemIds();
});

function saveItem(){
    let itemID = $("#itemId").val();
    let itemName = $("#ItemName").val();
    let itemQty = $("#itemQty").val();
    let unitPrice = $("#unitPrice").val();

    var Item= new ItemDTO(itemID,itemName,itemQty,unitPrice);
    itemDB.push(Item);
    clearAllItems();
}


$("#itemId").keyup(function () {
    let input = $("#itemId").val();
    if (regExItemID.test(input)) {
        $("#itemId").css('border', '2px solid green');
        $("#error").text("");
    } else {
        $("#itemId").css('border', '2px solid red');
        $("#error").text("Wrong format : C00-001");
    }
});

/* Item Update*/
$("#updateItem").click(function () {
    for (var i in customerDB ){
        if ($("#itemId").val() == itemDB[i].getItemName()){
            let itemId = $("#itemId").val();
            let itemName = $("#ItemName").val();
            let itemQty = $("#itemQty").val();
            let price = $("#unitPrice").val();

            var item = new ItemDTO(itemId,itemName,itemQty,price);
            itemDB[i].setName(item.getItemName());
            itemDB[i].setAddress(item.getItemQTY());
            itemDB[i].setContact(item.getPrice());
        }
    }
    loadAllItem();
    clearAllItems();
    loadItemIds();

});
/*Delete Item*/
$("#deleteItem").click( function () {
    for(var i in itemDB) {
        if ($("#itemId").val() == itemDB[i].getItemCode()){
            itemDB.splice(i,1);
        }
    }
    /*End of the Delete Button*/
    loadAllItem();
    clearAllItems();
    loadItemIds();
});

function clearAllItems() {
    $('#itemId,#ItemName,#itemQty,#unitPrice').val("");
    $('#itemId,#ItemName,#itemQty,#unitPrice').css('border', '2px solid #ced4da');
    $('#itemId').focus();
   // $("#addItem").attr('disabled', true);
    loadAllItem();

}
$("#searchItem").click(function (){
    searchItem();
});
function searchItem() {
    let val = $("#srcItemID").val();
    for (let i = 0; i < itemDB.length; i++) {
        if (itemDB[i].getItemCode() == val){
            $('#itemId').val(itemDB[i].getItemCode());
            $("#ItemName").val(itemDB[i].getItemName());
            $("#itemQty").val(itemDB[i].getItemQTY());
            $("#unitPrice").val(itemDB[i].getPrice());
        }
    }
    loadAllItem();

}
function loadItemIds() {
    $("#cmbOrderItemCode").empty();
    $('#cmbOrderItemCode').append(new Option("Item Code", ""));
    for (var i in itemDB){
        let code=itemDB[i].getItemCode();
        $('#cmbOrderItemCode').append(new Option(code, code));
    }
}