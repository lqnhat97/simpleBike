$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        var fdata = $(this).serializeArray();
        fdata = JSON.stringify(fdata);
        $.ajax({
            contentType: 'application/json',
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