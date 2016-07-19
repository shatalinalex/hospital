/**
 * Created by Александр on 19.07.2016.
 */

$(function() {

    $("input[name='bookingButton']").click(function(){
        $.ajax({
            url: '/index/save/',
            type: 'POST',
            data: $("#bookForm").serialize(),
            success: function (response) {
                response = $.parseJSON(response);
                if (response.success) {
                    alert('Done!');
                    window.location.reload();
                }else{
                    alert(response.msg);
                }
            },
            error: function (xhr, str) {
                alert("Error!");
            }
        });
    });
    $("#doctor").change(function (obj) {
        if (!this.value || this.value == 0)
            return;

        $.ajax({
            url: '/index/loadlist/',
            type: 'POST',
            data: {did: this.value},
            success: function (response) {
                response = $.parseJSON(response);

                $("#blist").html('');

                if (response.success && typeof response.data != 'undefined') {

                    var str = '';
                    $.each(response.data, function (i, item) {
                        str += item.booking_date + " " + item.hospital_id + '<br>';
                    });

                    $("#blist").html(str);


                }else{
                    alert(response.msg);
                }

                $("#hArea").show();
                $("#datepicker").datepicker({
                    inline: true,
                    minDate:new Date(),
                    firstDay:1,
                    dateFormat:'yy-mm-dd',
                    constrainInput: false,
                    altFormat:'yy-mm-dd',
                    altField:'#actualDate',
                    onSelect: function (dateText, inst){
                        $.ajax({
                            url: '/index/check/',
                            type: 'POST',
                            data: {did: $("#doctor").val(),date:dateText},
                            success: function (response) {
                                response = $.parseJSON(response);
                                if (response.success && response.state) {
                                    alert('Busy!');
                                }
                            },
                            error: function (xhr, str) {
                                alert("Error!");
                            }
                        });

                    }
                });


                $.ajax({
                    url: '/index/hospital/',
                    type: 'POST',
                    data: {did:$("#doctor").val()},
                    success: function(response) {
                        response = $.parseJSON(response);
                        if(response.success  && typeof response.data != 'undefined'){
                            $("#hospital").empty();
                            $.each(response.data, function (i, item) {
                                $("#hospital").append($('<option>', {
                                    value: item.id,
                                    text : item.title
                                }));
                            });
                        }
                    },
                    error:  function(xhr, str){
                        alert("Error!");
                    }
                });
            },
            error: function (xhr, str) {
                alert("Error!");
            }
        });
    });

});