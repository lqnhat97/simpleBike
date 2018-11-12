$(document).ready(() => {
    $("form").submit((e) => {
        e.preventDefault();
        var userName = $("#inputUserName").val();
        var password = $("#inputPassword").val();
        var fdata = {
            userName,
            password
        };
        fdata = JSON.stringify(fdata);
        $.ajax({
            contentType: 'application/json',
            url: 'http://localhost:8088/api/users',
            type: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res) => {
            if (res.auth != false) {
                localStorage.setItem("key", res.access_token);
                if (res.user.staffRole === 1) {
                    window.location.replace("http://localhost:8088/contact");
                } else if (res.user.staffRole === 3) {
                    window.location.replace("http://localhost:8088/request");
                } else {
                    alert("Fail");
                }
            }
            else {
                alert("Sai thông tin đăng nhập!");
            }
        }).catch(err => {
            console.log("Co loi");
            console.log(err);
        })
    })
})