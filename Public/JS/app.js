$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        var cus_name=$("#cus_name").val();
        var cus_tel=$("#cus_tel").val();
        var cus_des=$("#cus_des").val();
        var cus_note=$("#cus_note").val();
        var fdata = {cus_name,cus_tel,cus_des,cus_note}
        fdata = JSON.stringify(fdata);
        $.ajax({
            contentType: 'application/json',
            beforeSend: function(request){
                request.setRequestHeader("x-access-token",localStorage.getItem("key"))
            },
            url: 'http://localhost:8088/bookBike/',
            type: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done(() => {
            $("#notify").text("Đã ghi nhận thành công thông tin khách hàng!");
            $("#notify").css("display","block");
            $("#notify").css("color","blue");
        }).catch(err=>{
            console.log(err);
            $("#notify").text("Đã xảy ra lỗi");
            $("#notify").css("display","block");
            $("#notify").css("color","red");
        })
    });
})