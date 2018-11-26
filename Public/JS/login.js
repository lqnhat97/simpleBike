$(document).ready(() => {
    var role = 0;
    $("#role").change(() => {
        if ($("#role").prop("checked"))
            role = 1;
        else role = 0;
    })
    $("form").submit((e) => {
        e.preventDefault();
        var userName = $("#inputUserName").val();
        var password = $("#inputPassword").val();
        var fdata = {
            userName,
            password,
            role
        };
        fdata = JSON.stringify(fdata);
        $.ajax({
            contentType: 'application/json',
            url: '/api/users',
            type: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res) => {
            if (res.auth != false) {
                localStorage.setItem("key", res.access_token);
                if (role === 1) {
                    localStorage.setItem("idDriver", res.user.idDriver);
                    window.location.replace("/bike");
                } else {
                    if (res.user.staffRole === 1) {
                        window.location.replace("/contact");
                    } else if (res.user.staffRole === 2) {
                        window.location.replace("/locate");
                    } else if (res.user.staffRole === 3) {
                        window.location.replace("/request");
                    } else {
                        alert("Fail");
                    }
                }
            } else {
                alert("Sai thông tin đăng nhập!");
            }
        }).catch(err => {
            console.log("Co loi");
            console.log(err);
        })
    })
})