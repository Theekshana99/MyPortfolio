


const orderCusIDRegEx = /^(C00-)[0-9]{3,4}$/;
const orderItemCodeRegEx = /^(I00-)[0-9]{3,4}$/;
const orderIDRegEx = /^(O00-)[0-9]{4,5}$/;
const quantityRegEx = /^[1-9][0-9]*$/;


$("#txtOrderId").val("O00-0001");

function displayDateTime() {
    var date = new Date()
    var ampm = date.getHours( ) >= 12 ? 'PM' : 'AM';
    var hours = date.getHours( ) % 12;
    hours = hours ? hours : 12;
    hours=hours.toString().length===1? 0+hours.toString() : hours;

    var minutes=date.getMinutes().toString()
    minutes=minutes.length===1 ? 0+minutes : minutes;

    var seconds=date.getSeconds().toString()
    seconds=seconds.length===1 ? 0+seconds : seconds;

    var year=date.getFullYear().toString();

    var month=(date.getMonth() +1).toString();
    month=month.length===1 ? 0+month : month;

    var day=date.getDate().toString();
    day=day.length===1 ? 0+day : day;

    var x1=day + "/" + month + "/" + year;
    var x2 = hours + ":" +  minutes + ":" +  seconds + " " + ampm;
    $("#txtDate").val(x1);
    $("#txtTime").val(x2);
    playDateTime();
}
function playDateTime(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('displayDateTime()',refresh)
}
playDateTime();

$('#cmbOrderCustId').on('change', function() {
    var id = $(this).val();

    if(id===""){
        $("#txtOrderCustName").val("");
        $("#txtOrderCustAddress").val("");
        $("#txtOrderCustContact").val("");
    }else{
        var customerObject;
        for(var i in customerDB){
            if(customerDB[i].getID()===id){
                customerObject = customerDB[i];
            }
        }
        $("#txtOrderCustName").val(customerObject.getName());
        $("#txtOrderCustAddress").val(customerObject.getAddress());
        $("#txtOrderCustContact").val(customerObject.getContact());
    }
});

$('#cmbOrderItemCode').on('change', function() {
    var code = $(this).val();

    if(code===""){
        $("#txtOrderItemName").val("");
        $("#txtOrderItemPrice").val("");
        $("#txtOrderItemQty").val("");
    }else{
        var itemObject;
        for(var i in itemDB){
            if(itemDB[i].getItemCode()===code){
                itemObject = itemDB[i];
            }
        }
        $("#txtOrderItemName").val(itemObject.getItemName());
        $("#txtOrderItemPrice").val(itemObject.getPrice());
        setQtyOnHand();
        //$("#txtOrderItemQty").val(itemObject.getQty());
    }
});


$("#txtQuantity").keyup(function (event) {
    // setOrderButtons();
    if($("#txtQuantity").val()===""){
        $("#txtQuantity").css('border','1px solid #ced4da');
        $("#txtSubTotal").val("");
    }else if (parseInt($("#txtQuantity").val())<=parseInt($("#txtOrderItemQty").val()) & quantityRegEx.test($("#txtQuantity").val())){
        $("#txtQuantity").css('border','3px solid green');
        var st=parseInt($("#txtQuantity").val()) * parseFloat($("#txtOrderItemPrice").val());
        $("#txtSubTotal").val(st.toFixed(2));
    }else{
        $("#txtQuantity").css('border','3px solid red');
        $("#txtSubTotal").val("");
    }
});

$('#btnAddToCart').click(function () {
    let itmCode = $("#cmbOrderItemCode").val();
    let itmName = $("#txtOrderItemName").val();
    let itmPrice = $("#txtOrderItemPrice").val();
    let itmQty = $("#txtQuantity").val();
    let itmTotal = $("#txtSubTotal").val();

    var cartObject=new OrderTM(itmCode,itmName,itmPrice,itmQty,itmTotal);
    if(isOrderItemExists(cartObject.getId())){
        for(var i in cartArray){
            if(cartArray[i].getId()===itmCode){
                let newQty=parseInt(cartArray[i].getQty())+parseInt(cartObject.getQty());
                cartArray[i].setQty(newQty);
                let newTotal=parseFloat(cartArray[i].getTotal())+parseFloat(cartObject.getTotal());
                cartArray[i].setTotal(newTotal.toFixed(2));
            }
        }
    }else{
        cartArray.push(cartObject);
    }

    $("#txtQuantity").val("");
    $("#txtSubTotal").val("");
    $("#txtQuantity").css('border','1px solid #ced4da');

    setTotalPurchase();
    setQtyOnHand();
    loadAllCartObjects();
});

$('#btnPurchaseOrder').click(function () {
    let orderID = $("#txtOrderId").val();
    let cusID = $("#cmbOrderCustId").val();
    let orderDate = $("#txtDate").val();
    let orderTime = $("#txtTime").val();
    let orderCost = $("#txtTotal").val();

    let detailList=new Array();

    for (var i in cartArray){
        let itmID=cartArray[i].getId();
        let itmQty=cartArray[i].getQty();
        let itmPrice=cartArray[i].getPrice();
        let itmTotal=cartArray[i].getTotal();

        var orderDetail=new OrderDetailDTO(itmID,orderID,itmQty,itmPrice,itmTotal);
        detailList.push(orderDetail);
    }

    var orderObject=new OrderDTO(orderID,cusID,orderDate,orderTime,orderCost,detailList);
    OrderDB.push(orderObject);

    reducePurchasedItems();
    cartArray.splice(0, cartArray.length);
    setOrderId();
    setTotalPurchase();
    clearAllOrderFields();
    loadAllCartObjects();
});

function reducePurchasedItems() {
    for (var i in cartArray){
        var orderDetail=cartArray[i];
        for (var j in itemDB){
            if(itemDB[j].getItemCode()===orderDetail.getQty()){
                itemDB[j].setQty(itemDB[j].getQty()-orderDetail.getQty())
            }
        }
    }
}

function setOrderId() {
    var oldOrderId=$("#txtOrderId").val();
    var index=parseInt(oldOrderId.split("-")[1]);
    var newOrderId;
    if(index<9){
        index++;
        newOrderId="O00-000"+index;
    }else if(index<99){
        index++;
        newOrderId="O00-00"+index;
    }else if(index<999){
        index++;
        newOrderId="O00-0"+index;
    }else if(index<9999){
        index++;
        newOrderId="O00-"+index;
    }
    $("#txtOrderId").val(newOrderId);
}

function clearAllOrderFields() {
    $("#txtOrderCustName").val("");
    $("#txtOrderCustAddress").val("");
    $("#txtOrderCustContact").val("");
    $("#txtOrderItemName").val("");
    $("#txtOrderItemPrice").val("");
    $("#txtOrderItemQty").val("");
    $("#txtQuantity").val("");
    $("#txtSubTotal").val("");
    $("#txtQuantity").css('border','1px solid #ced4da');
}

function loadAllCartObjects() {
    $("#orderTable").empty();

    for (var i in cartArray){
        let itmCode=cartArray[i].getId();
        let itmName=cartArray[i].getName();
        let itmPrice=cartArray[i].getPrice();
        let itmQty=cartArray[i].getQty();
        let itmTotal=cartArray[i].getTotal();

        let row = `<tr><td>${itmCode}</td><td>${itmName}</td><td>${itmPrice}</td><td>${itmQty}</td><td>${itmTotal}</td></tr>`;
        $("#orderTable").append(row);
    }
}

function setTotalPurchase() {
    let total=0;
    for(var i in cartArray){
        total+=parseFloat(cartArray[i].getTotal());
    }
    $("#txtTotal").text(total.toFixed(2));
}

function setQtyOnHand() {
    var itemObject;
    for(var i in itemDB){
        if(itemDB[i].getItemCode()===$("#cmbOrderItemCode").val()){
            itemObject = itemDB[i];
        }
    }
    let qty=itemObject.getItemQTY();
    for(var i in cartArray){
        if(cartArray[i].getId()===$("#cmbOrderItemCode").val()){
            qty-= cartArray[i].getQty();
        }
    }
    $("#txtOrderItemQty").val(qty);
}

function isOrderItemExists(itmCode) {
    for(var i in cartArray){
        if(cartArray[i].getId()===itmCode){
            return true;
        }
    }
    return false;
}