
function dateParse(source){ 
	var reg = new RegExp('^\d+(\-|\/)\d+(\-|\/)\d+\x24'); 
	if('string' === typeof source){
		if(reg.test(source) || isNaN(Date.parse(source))){ 
			var d = source.split(/ /),
				d1 = d.length > 1
						? d[1].split(/[^\d]/) 
						: [0, 0, 0],
				d0 = d[0].split(/[^\d]/);
			return new Date(d0[0] -0,
							d0[1] -1, 
							d0[2] -0,
							d1[0] -0,
							d1[1] -0,
							d1[2] -0);
		}else{
			return new Date(source); 
		}
	}
	return new Date();
}

//对目标数字进行0补齐处理
function pad(source, length){
	var pre = '',
		negative = (source < 0), 
		string = String(Math.abs(source)); 
	if(string.length < length){
		pre = (new Array(length - string.length + 1)).join('0');
	}
	return (negative ? '-' : "") + pre + string; 
}

//对目标日期对象进行格式化
function dateFormat(source, pattern){
	if('string' != typeof pattern){
		return source.toString();
	}

	function replacer(patternPart, result){
		pattern = pattern.replace(patternPart, result); 
	}

	var year    = source.getFullYear(),
		month   = source.getMonth() + 1, 
		date2   = source.getDate();

	replacer(/yyyy/g, pad(year, 4));
	replacer(/MM/g, pad(month, 2));
	replacer(/dd/g, pad(date2, 2));

	return pattern;
}

//对目标字符串进行格式
function format(source, opts){
	source = String(source);
	var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
	if(data.length){
		data = data.length == 1?
			(opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
			: data;
		return source.replace(/#\{(.+?)\}/g, function (match, key) {
			var replacer = data[key];
			if ('[object Function]' == toString.call(replacer)) { 
				replacer = replacer(key);
			}
			return ('undefined' == typeof  replacer ? '' : replacer);
		});
	}
	return source;
}

var targetTime;
var timer;
function printTime(leftTime){
	var leftDate = {
		dd: parseInt(leftTime /1000 /60 /60 /24,10),
		hh: parseInt(leftTime /1000 /60 /60%24, 10),
		mm: parseInt(leftTime /1000 /60 %60,10),
		ss: parseInt(leftTime /1000 %60,10)
	};
	$('#output').innerHTML = ''
		+ dateFormat(targetTime, '距离yyyy年MM月dd日')
		+ format('还有#{dd}天#{hh}小时#{mm}分钟#{ss}秒', leftDate);
}

function runTimer(first){
	var nowTime = new Date();
	var leftTime = targetTime - nowTime;
	if(first && leftTime <0){
		alert('目标时间小于当前时间');
		return;
	}
	printTime(leftTime);
	if(leftTime / 1000 ==0){
		return;  
	}
	timer = setTimeout(runTimer, 1000);
}

function startTimer(){
	var input = $('.myText').value;
	if(!input){
		alert('input time yyyy-mm-dd');
		return;
	}
	clearTimeout(timer);
	targetTime = dateParse(input);
	runTimer(true);
}

window.onload = function(){
	$.on($('.submit'), 'click', startTimer);
	$.on($('.reset'), 'click', reset);
}


function reset() {
	clearTimeout(timer);
	$('.error').innerHTML = '';
	$('.myText').value = '';
	$('#output').innerHTML = '';

}
