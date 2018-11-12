$(document).ready(function getAll() {
    $.ajax({
        url: 'http://localhost:8088/admin',
        type: 'POST',
        dataType: 'json',
        timeout: 10000
    }).done(function (data) {
        var state;
        data.forEach(element => {
            switch (element.requestState) {
                case 0:
                    state = "Not Locate";
                    break;
                case 1:
                    state = "Located";
                    break;
                case 2:
                    state = "Assigned";
                    break;
                case 3:
                    state = "Moving";
                    break;
                case 4:
                    state = "Finish";
                    break;
                case 5:
                    state = "No bike";
                    break;
            }
            //console.log(element);
            $('#user_info').html($('#user_info').html() +
                "<tr>" +
                "<td scope='row' class='col10per'>" + element.idRequest + "</td>" +
                "<td class='col15per'>" + element.clientName + "</td>" +
                "<td class='col15per'>" + element.clientPhone + "</td>" +
                "<td class='col20per'>" + element.clientAddress + "</td>" +
                "<td class='col10per'>" + state + "</td>" +
                "<td class='col15per'>" + element.requestTime + "</td>" +
                "<td class='col10per'> *  </td>" +
                "</tr>");
        });
    })

    function getRequestByState(state_param, state_text) {
        console.log(state_param);

        $.ajax({
            url: 'http://localhost:8088/admin/state',
            type: 'POST',
            data:JSON.stringify( {
                "state":state_param
            }),
            contentType:'application/json',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            console.log(data);
            data.forEach(element => {
                $('#user_info').html($('#user_info').html() +
                    "<tr>" +
                    "<td scope='row' class='col10per'>" + element.idRequest + "</td>" +
                    "<td class='col15per'>" + element.clientName + "</td>" +
                    "<td class='col15per'>" + element.clientPhone + "</td>" +
                    "<td class='col20per'>" + element.clientAddress + "</td>" +
                    "<td class='col10per'>" + state_text + "</td>" +
                    "<td class='col15per'>" + element.requestTime + "</td>" +
                    "<td class='col10per'> *  </td>" +
                    "</tr>");
            })
        })
    }


    $('.dropdown-item').click(function () {
        $('#dropdownMenuButton').text($(this).text());
    })
    $('#all').click(function () {
        $('#user_info').html("");
        getAll()
    });
    $('#isNotLocated').click(function () {
        $('#user_info').html("");
        getRequestByState(0, "Is Not Located");
    })
    $('#located').click(function () {
        $('#user_info').html("");
        getRequestByState(1, "Located");
    })
    $('#assigned').click(function () {
        $('#user_info').html("");
        getRequestByState(2, "Assigned");
    })
    $('#moving').click(function () {
        $('#user_info').html("");
        getRequestByState(3, "Moving");
    })
    $('#finish').click(function () {
        $('#user_info').html("");
        getRequestByState(4, "Finish");
    })
    $('#noBike').click(function () {
        $('#user_info').html("");
        getRequestByState(5, "No bike");
    })
})
