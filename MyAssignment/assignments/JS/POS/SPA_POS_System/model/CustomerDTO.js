function CustomerDTO(id,name,address,contact){
    var __id=id;
    var __name=name;
    var __address=address;
    var __contact=contact;

    this.getID = function () {
        return __id;
    }
    this.getName = function () {
        return __name;
    }

    this.getAddress = function () {
        return __address;
    }
    this.getContact = function () {
        return __contact;
    }

}