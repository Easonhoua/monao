var start = {
    isinitVal:false,
    ishmsVal:false,
    minDate: '1900-01-01 00:00:00',
    maxDate: '2099-06-30 23:59:59',
    format:"YYYY-MM-DD hh:mm:ss",
    choosefun:function(elem, datas) {
        end.minDate = datas;
    },
    okfun:function(elem, datas) {
    	end.minDate = datas;
    }
}
var end = {
    isinitVal:false,
    ishmsVal:false,
    minDate: '1900-01-01 00:00:00',
    maxDate: '2099-06-30 23:59:59',
    format:"YYYY-MM-DD hh:mm:ss",
    choosefun:function(elem, datas) {
        start.maxDate = datas;
    },
    okfun:function(elem, datas) {
    	start.maxDate = datas;
    }
}

$.jeDate('#start_time_select',start);
$.jeDate('#end_time_select',end);

//近7天
$('#nearly_seven_days').click(function() {
	start.maxDate = $.nowDate(0);
	end.minDate = $.nowDate(-7);
	$("#start_time_select").val($.nowDate(-7));
	$("#end_time_select").val($.nowDate(0));
});

//近30天
$('#nearly_Thirty_days').click(function() {
	start.maxDate = $.nowDate(0);
	end.minDate = $.nowDate(-30);
	$("#start_time_select").val($.nowDate(-30));
	$("#end_time_select").val($.nowDate(0));
});

//获取相应省下的市
$('#area_province').change(function(){
	var url=$('#main_url').val();
	var value = $("#area_province").val();
	if(value)
	{
	    $.ajax({ 
	        type: 'post', 
	        url: url+'/user/city.do',
	        data: 'id='+value, 
	        dataType: 'html', 
	        success: function(data) { 
	            if(data)
	            {       
	                $('#area_city').html(data);
	                $('#area_city').val(0);
	            }
	        },
	        error: function(data){  
	        }
	    }); 
	}
});

//重置操作
$('#rest-data').click(function() {    
    $('#username').val('');
    $('#dosmono-id').val('');
    $('#area_province').val(0);
    $('#area_province').trigger('changed.selected.amui');
    $('#area_city').val(0);
    $('#area_city').trigger('changed.selected.amui');
    $('#account-status').val(0);
    $('#account-status').trigger('changed.selected.amui');
    $('#start_time_select').val('');
    $('#end_time_select').val('');
});

//筛选操作
$('#screen-user').click(function() { 
	var url=$('#main_url').val();
	var $username = $('#username');
	var $dosmono_id = $('#dosmono-id');
	var $area_province = $('#area_province');
	var $area_city = $('#area_city');
	var $account_status = $('#account-status');
	var $start_time_select = $('#start_time_select');
	var $end_time_select = $('#end_time_select');
	

	if((($username.val() == '')||($username.val().length == 0))&& 
		(($dosmono_id.val() == '')||($dosmono_id.val().length == 0))&& 
		($area_province.val()==0)&&
		($area_city.val()==0)&& 
		($account_status.val()==0)&& 
		(($start_time_select.val() == '')||($start_time_select.val().length == 0))&& 
		(($end_time_select.val() == '')||($end_time_select.val().length == 0)))
		{
			return false;
		}
		else
		{

			$.ajax({ 
			    type: 'post', 
			    url: url+'/user/userlist', 
			    data: 'screen=1&startpage=1'+'&username='+$username.val()+'&monoid='+$dosmono_id.val()+'&province='+$area_province.val()+'&city='+$area_city.val()+'&statusinfo='+$account_status.val()+'&starttime='+$start_time_select.val()+'&endtime='+$end_time_select.val(), 
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

//修改软件版本状态值
function edit_account(monoid,state){
	var url=$('#main_url').val();
	var ret=0;
	$.ajax({ 
	    type: 'post', 
	    url: url+'/user/on_off_account.do', 
	    data: 'monoid='+monoid+'&state='+state, 
	    dataType: 'text', 
	    success: function(data) { 
	    	if(data)
	    	{    	
	    	  var u_id='#state_'+monoid;
	    	  var edit='#edit_'+monoid;
	    	  if(state)
	    	  {	    		 
    			if($(u_id).hasClass('am-text-danger'))
    			{
    				$(u_id).removeClass('am-text-danger');
    				$(u_id).html('正常');
    				$(edit).html("冻结账号");	
    				$(edit).data('state',0);
    			}

	    	  }
	    	  else
	    	  {
    			if(!$(u_id).hasClass('am-text-danger'))
    			{
   				 	 $(u_id).addClass('am-text-danger'); 
    				 $(u_id).html('冻结'); 
    				 $(edit).html("恢复账号");		
    				 $(edit).data('state',1);
    			}  

	    	  }

	    	}

	    },
	    error: function(data){ 	
	    }
	});	
	
	
}

$(function() {
	$('.am-table').find('.a-link').add('#doc-confirm-toggle').on('click', function() {
	      $('#userlist-id-confirm').modal({
	        relatedTarget: this,
	        onConfirm: function(options) {
	          var $link = $(this.relatedTarget);
	            if($link.data('id'))
	            {
	              edit_account($link.data('id'),$link.data('state'));
	            }
	            
	        },
	        onCancel: function() {
	          return;
	        }
	      });
	    });
});
