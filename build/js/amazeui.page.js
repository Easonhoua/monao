!function($,UI){
	"use strict";
	function page(data){
		this.$element=data.element;
		this.first=true;
		data.option.curr=parseInt(data.option.curr)||1;
		data.option.theme=data.option.theme||'default';
		data.option.groups=(typeof data.option.groups!="undefined")?parseInt(data.option.groups):5;
		this.option=data.option;
		this._init();
	}

	page.prototype._init=function(){
		if(this.option.groups>0){
			this.option._prev=Math.ceil(this.option.groups/2);
			this.option._next=Math.floor(this.option.groups/2);
			this.option._status={prev:false,next:false};
		}
		if(this.option.before){
			var _this=this;
			this.option.before(this,function(){
				_this._load();
			});
		}else{
			this._load();
		}		
	}

	page.prototype._load=function(){
		var option=this.option;
		if(!option.pages||option.pages==1){
			return false;
		}
		var $element = this.$element;
		var npage=option.curr;
		var apage=option.pages;
		
		var $ul=$("<ul><li><span style='padding: 6px 12px;border-radius: 3px;'>每页20条数据 共"+apage+"页 当前第"+npage+"页</span></li></ul>");
		//$ul.addClass('am-pagination am-pagination-default am-page-'+option.theme);
		$ul.addClass('am-pagination tpl-pagination');
		$element.html($ul)

		var list=[];
		if(option.curr>1&&option.prev!==false)list.push({key:'prev',value:option.prev||'上一页',page:option.curr-1});
		if(option.first)list.push({key:'first',value:option.first,page:1});
		for(var i=1;i<=option.pages;i++){
			list.push({key:i,value:i,page:i});
		}
		if(option.last)list.push({key:'last',value:option.last,page:option.pages});
		if(option.curr!=option.pages&&option.next!==false)list.push({key:'next',value:option.next||'下一页',page:option.curr+1});
		//groups处理
		var judge=function(option,index){
			var result='<span>...</span>';
			if(index<=((option.curr+option._next)<option.pages?option.curr-option._prev:option.pages-option.groups)){
				result=option._status.prev?"":result;
				option._status.prev=true;
				return result;
			}
			if(index>((option.curr+option._next)<option.groups?option.groups:option.curr+option._next)){
				result=option._status.next?"":result;
				option._status.next=true;
				return result;				
			}
			return false;
		}
		//渲染
		var render=function(context,$li,index){
			var option=context.option,r;
			//是否显示分页按钮
			if(option.groups==0&&typeof index=="number"){
				return false;
			}
			//数量
			if(typeof index=="number"&&option.groups<option.pages){
				if((r=judge(option,index))!==false){
					return r;
				}
			}
			//当前按钮
			if(option.curr==index){
				$li.addClass('am-active');
			}
			return $li;
		}
		var _render=option.render?option.render:render;
		for (var i in list) {
			var $li=$('<li><a href="javascript:" data-page="'+list[i]['page']+'">'+list[i]['value']+'</a></li>');
			var res;
			if(!option.render||!(res=option.render(this,$li,list[i]['key']))){
				res=render(this,$li,list[i]['key']);
			}
			$ul.append(res);
		}
		$ul.append("<li style='padding-left: 50px;'><span style='padding: 6px 12px;border-radius: 3px;'>跳转</span></li><li style='padding-right: 5px;'><input id='curr_input' type='number' style='display: inherit;margin-bottom: 5px;padding: 6px 12px;width: 100px;border-radius: 3px;border: 1px solid #ddd;font-size: 18px;' value='"+npage+"' /></li><li><span style='padding: 6px 12px;border-radius: 3px;'>页</span></li><li><button id='setpage' type='button' class='am-btn am-btn-secondary' style='border-radius: 3px;padding: 6px 12px;margin-bottom: 5px;font-size: 18px;'>确定</button></li>");
		this._on();
		if(this.option.after){
			var _this=this;
			this.option.after(this,function(){
				_this._jump();
			});
		}else{
			this._jump();
		}
	}

	page.prototype._on=function(){
		var _this=this;
		_this.$element.one('click','li a',function(){
			_this.option.curr=$(this).data('page');
			_this._init();
		});	
	}

	page.prototype._jump=function(){
		if(!this.first&&typeof this.option.jump=='string'&&this.option.jump.indexOf('%page%')>-1){
			window.location.href=this.option.jump.replace('%page%',this.option.curr);
			return;
		}		
		if(typeof this.option.jump=='function'){
			this.$element.trigger('jump.page.amui');
			this.option.jump(this,this.first);
		}
		this.first=false;
	}
	
	page.prototype.remove=function(callback){
		this.$element.trigger('remove.page.amui');
		this.$element.remove();
		this.$element.trigger('removed.page.amui');
		if(callback)callback();
	}
	
	page.prototype.setCurr=function(curr,callback){
		this.option.curr=parseInt(curr);
		this._init();
		if(callback)callback();
	}

	$.fn.extend({
		'page':function(option){
			return new page({
				element:this,
				option:option
			});
		}
	});
	UI.ready(function(context) {
		$('[data-am-page]', context).each(function(){
			var option = UI.utils.parseOptions($(this).attr('data-am-page'));
			//将data api中的参数转为函数
			option.before=window[option.before];
			option.render=window[option.render];
			option.after=window[option.after];
			if(option.jump&&option.jump.indexOf('%page%')==-1){
				option.jump=window[option.jump];
			}
		  	$(this).page(option);
		})
	});
	
}(jQuery,jQuery.AMUI);