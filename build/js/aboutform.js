$(function () {
    var url=$('#main_url').val();
    var nowpage=parseInt($('#nowpage').val());
    var allpage=parseInt($('#allpage').val());


    //返回的是一个page示例，拥有实例方法
    var $page = $('#page').page({
        pages: allpage, //页数
        curr: nowpage, //当前页
        theme: 'default', //主题
        groups: 5, //连续显示分页数
        prev: '«', //若不显示，设置false即可
        next: '»', //若不显示，设置false即可
        first: "首页",
        last: "尾页", //false则不显示
        before: function(context, next) { //加载前触发，如果没有执行next()则中断加载
            next();
        },
        render: function(context, $element, index) { //渲染[context：对this的引用，$element：当前元素，index：当前索引]
            //逻辑处理
            if (index == 'last') { //虽然上面设置了last的文字为尾页，但是经过render处理，结果变为最后一页
                $element.find('a').html('最后一页');
                return $element; //如果有返回值则使用返回值渲染
            }
            return false; //没有返回值则按默认处理
        },
        after: function(context, next) { //加载完成后触发
            next();
        },
        /*
         * 触发分页后的回调，如果首次加载时后端已处理好分页数据则需要在after中判断终止或在jump中判断first是否为假
         */
        jump: function(context, first) {
            if(!first)
            {
                if(context.option.curr > 0 && context.option.curr!=nowpage)
                {
                    $.ajax({
                        type: 'post',
                        url: url+'/user/userlist',
                        data: 'startpage='+context.option.curr+'&username='+$('#username').val()+'&monoid='+$('#dosmono-id').val()+'&province='+$('#area_province').val()+'&city='+$('#area_city').val()+'&statusinfo='+$('#account-status').val()+'&starttime='+$('#start_time_select').val()+'&endtime='+$('#end_time_select').val(),
                        dataType: 'html',
                        beforeSend: function( xhr ) {
                            $('#my-modal-loading').modal('open');
                        },
                        success: function(data) {
                            if(data)
                            {
                                $('#main_area').html(data);
                            }
                            $('#my-modal-loading').modal('close');
                        },
                        error: function(data){
                            $('#my-modal-loading').modal('close');
                        }
                    });
                }
            }
        }
    });


    $('#setpage').click(function() {
        var pages = $('#curr_input').val();
        var reg =/^\+?[1-9][0-9]*$/;

        if(!reg.test(pages)){
            $('#page_err').html('请输入正数').show();
            $("#curr_input").focus();
            return false;
        }

        if(pages > allpage)
        {
            $('#page_err').html('数值范围超过总页数').show();
            $("#curr_input").focus();
            return false;
        }

        if(pages!=nowpage)
        {
            $.ajax({
                type: 'post',
                url: url+'/user/userlist',
                data: 'startpage='+pages+'&username='+$('#username').val()+'&monoid='+$('#dosmono-id').val()+'&province='+$('#area_province').val()+'&city='+$('#area_city').val()+'&statusinfo='+$('#account-status').val()+'&starttime='+$('#start_time_select').val()+'&endtime='+$('#end_time_select').val(),
                dataType: 'html',
                beforeSend: function( xhr ) {
                    $('#my-modal-loading').modal('open');
                },
                success: function(data) {
                    if(data)
                    {
                        $('#main_area').html(data);
                    }
                    $('#my-modal-loading').modal('close');
                },
                error: function(data){
                    $('#my-modal-loading').modal('close');
                }
            });
        }

    });

    $('#curr_input').click(function() {

        if(!$('#page_err').is(':hidden'))
        {
            $('#page_err').hide();
        }
    });

})