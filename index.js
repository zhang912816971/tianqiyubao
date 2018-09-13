

// 获取城市下拉的表头
let citys ;

$.ajax({
	url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
	success:function(e){
	   citys = e.data;
	   let str = "";
	   for(key in citys){
	   		str +=`<div class="xd">
	   		<div class="shenghui">${key}</div>`;
	   		str +=`<div class="city">`;
	   		for(key2 in citys[key]){
	   			str+=`<div class="con">${key2}</div>`;
	   		}
	   		str += `</div></div>`;
	   }
	   $(str).appendTo($(".cityBox"));
	}
})

// 鼠标点击表头出现城市下拉
$(function(){
	$("header .diz").click(function(){
		$(".cityBox").css({'display':'block'}).animate({height:'100%'},300);
	});
	$(".cityBox").click(function(event){
		// 弹出框升起并将城市赋给表头
		if(event.target.className == "con"){
			$("header .diz").text(event.target.innerText);

			// 传输至内容
			let cityname = $("header .diz").text();
			$.ajax({
					url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${cityname}`,
					data:{'city':cityname},
				    type:"get",
				    dataType:"jsonp",
					success:function(e){
						// let citylis = e.data;
						// let dat_condition = citylis['weather'].dat_condition;
						// let wind_direction = citylis['weather'].wind_direction;
						// let wind_level = citylis['weather'].wind_level;
						// let current_temperature = citylis['weather'].current_temperature;
						// $("header .screen h3 span").text(current_temperature);
						// $("header .screen h4 span").text(dat_condition);
						// $("header .screen h5 span").text(`${wind_direction} ${wind_level}级`);
						// //添加小时
						// let stri1 = "";
						// for(let i=0;i< citylis['weather']['hourly_forecast'].length;i++){
						// 	stri1 +=`<div class="box">
						// 		<div class=""><span>${citylis['weather']['hourly_forecast'][i].hour}</span>:00</div>
						// 		<img src="img/${citylis['weather']['hourly_forecast'][i].weather_icon_id}.png">
						// 		<div><span>${citylis['weather']['hourly_forecast'][i].wind_level}</span>°</div>
						// 		</div>`
						// 		// console.log(citylis['weather']['hourly_forecast'][1].hour)
								
						// }
						// $(".hours .con").html(stri1);
						upDate(e.data);

						
					}
				})
			//
			// 升起
			$(".cityBox").css({'display':'none'}).animate({height:'0'},200);
		}
	});
	//播放语音
	$('.audioBtn').click(function(event){
		event.stopPropagation();//取消弹框附加事件
		let speech = window.speechSynthesis;
		let speechset = new SpeechSynthesisUtterance();
		let text =$("header .diz").text()+"当前气温"+$("header .screen h3 span").text()+"°"+$("header .screen h4 span").text();
		speechset.text = text;
		speech.speak(speechset);	
	});


	//默认界面
	function upDate(data){
		let dat_condition = data['weather'].dat_condition;
		let wind_direction = data['weather'].wind_direction;
		let wind_level = data['weather'].wind_level;
		let current_temperature = data['weather'].current_temperature;
		// dat_weather_icon_id
		//day
		$("header .screen h3 span").text(current_temperature);
		$("header .screen h4 span").text(dat_condition);
		$("header .screen h5 span").text(`${wind_direction} ${wind_level}级`);
		$(".day .today .digao").text(data['weather'].dat_low_temperature+"°-"+data['weather'].dat_high_temperature+"°");
		$(".day .today .tody").text(data['weather'].dat_condition);
		$(".day .today img").attr('src',`img/${data['weather'].dat_weather_icon_id}.png`);
		$(".day .tomorrow .digao").text(data['weather'].tomorrow_low_temperature+"°-"+data['weather'].dat_high_temperature+"°");
		$(".day .tomorrow .tody").text(data['weather'].tomorrow_condition);
		$(".day .tomorrow img").attr('src',`img/${data['weather'].tomorrow_weather_icon_id}.png`);
		$("header .screen .aqi .zhil").text(data['weather'].aqi);
		$("header .screen .aqi .you").text(data['weather'].quality_level);
		//添加小时hours
		let stri = "";
		for(let i=0;i< data['weather']['hourly_forecast'].length;i++){
			stri +=`<div class="box">
				<div class=""><span>${data['weather']['hourly_forecast'][i].hour}</span>:00</div>
				<img src="img/${data['weather']['hourly_forecast'][i].weather_icon_id}.png">
				<div><span>${data['weather']['hourly_forecast'][i].wind_level}</span>°</div>
				</div>`
				// console.log(citylis['weather']['hourly_forecast'][1].hour)
				
		}
		$(".hours .con").html(stri);
		//添加周week
		let str2 = "";
		let str3 = "";
		let arr = ["日","一","二","三","四","五","六"];
		let date1 = [];
		let wdc = [];
		let zdw = [];
		for(let weekkey of data['weather']['forecast_list']){
			let date = new Date(weekkey.date);
			str2 +=`<div class="boxx">
				<div><span>星期${arr[date.getDay()]}</span></div>
				<div class=""><span>${date.getMonth()}/${date.getDate()}</span></div>
				<div class=""><span>${weekkey.condition}</span></div>
				<img src="img/${weekkey.weather_icon_id}.png">
			</div>`;

			str3 += `<div class="boxx">
				<img src="img/${weekkey.weather_icon_id}.png">
				<div class=""><span>${weekkey.condition}</span></div>
				<div>${weekkey.wind_direction}</div>
				<div><span>${weekkey.wind_level}</span>级</div>
			</div>`;
			date1.push(`星期${arr[date.getDay()]}`);
			wdc.push(weekkey.high_temperature);
			zdw.push(weekkey.low_temperature);
		}
		$(".week .conn").html(str2);
		$(".week .xian").html(str3);
		
		 // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init($(".cent")[0]);
        // 指定图表的配置项和数据
        var option = {
            
            tooltip: {},
            // legend: {
            //     data:['销量']
            // },
            xAxis:{
                data: date1
            },
            yAxis: {},
            series: [{
                // name: '销量',
                type: 'line',
                data: wdc
            },{type: 'line',
                data: zdw}]
        };

        
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


	}
	$.ajax({
		url:`https://www.toutiao.com/stream/widget/local_weather/data/?city=${'太原'}`,
		data:{'city':'太原'},
	    type:"get",
	    dataType:"jsonp",
		success:function(e){
			console.log(e);
			upDate(e.data);
		}
	})
	

})





