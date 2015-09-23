/**
 * Created by elenahao on 15/9/21.
 */

(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.country-change', 'change', function(e) {
            e.preventDefault();
            var country_val = $('.country-change').val();
            if(country_val == '') {
                //如果国家下拉框为空，则后面的省份和城市下拉均制空
                $('.province-change').empty();
                $('.province-change').append('<option value="",selected="selected">--请选择--</option>');
                $('.city-change').empty();
                $('.city-change').append('<option value="",selected="selected">--请选择--</option>');
                return false;
            }else{
                questTable.find('#country').val(country_val);
                $.ajax({
                    url: questTable.attr('action'),
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    data: questTable.serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function(res) {
                        if (res.ret == 0) {
                            var obj = res.data;
                            var options = '';
                            $(obj).each(function(index){
                                var val = obj[index];
                                if (typeof val === 'object') {
                                    var option = '<option value='+val.id+'>'+val.name+'</option>';
                                    options = options + option;
                                } else {
                                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                                }
                            });
                            $('.province-change').append(options);
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            }
        });
    });
})($);
