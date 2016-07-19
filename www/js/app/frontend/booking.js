/**
 * Created by Александр on 19.07.2016.
 */

$(function() {

    $("#doctor").change(function (obj) {
        if (!this.value || this.value == 0)
            return;

        $.ajax({
            url: '/index/loadlist/',
            type: 'POST',
            data: {did: this.value},
            success: function (response) {
                response = $.parseJSON(response);
                if (response.success && typeof response.data != 'undefined') {


                    /*$.each(response.data, function (i, item) {
                     $("select[name='car']").append($('<option>', {
                     value: item.id,
                     text : item.title
                     }));
                     });

                     $("#blist").html('');

                     $("select[name='car']").trigger("chosen:updated");*/
                }else{
                    alert(response.msg);
                }
                $("#hArea").show();
                $("#datepicker").datepicker({
                    inline: true,
                    minDate:new Date(),
                    firstDay:1,
                    dateFormat:'yy-mm-dd',
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
            },
            error: function (xhr, str) {
                alert("Error!");
            }
        });
    });

});