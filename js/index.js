var debug_mode=false;
var mobile_mode=false;
var api_url="http://45.118.133.210:8083/api/block/get/";
var default_page=debug_mode?"activity_present":"index";
var last_scroll_top=0;

//如果進入點是ip，重新導向網址
if (window.location.hostname=="45.118.133.210"){
  window.location.href = window.location.href.replace("45.118.133.210","citi2016.unitedway.org.tw");
}

//如果hash改變，偵測並載入項目
window.onhashchange = function() {
  var target_page=window.location.hash.substr(1);
  if (target_page=="support"){
    target_page="page_support";
  }
  vm.sw_page(target_page);
}

if ($(window).width()<800){
  mobile_mode=true;
}
//cur_page:  window.location.hash==""?"index":window.location.hash.substr(1),
var vm=new Vue({
  el: "#app",
  data: {
    page_list: [
      {name: "index", text: "首頁"},
      {name: "support", text: "立即響應"},
      {name: "activity", text: "安雞樂業村"},
      {name: "about", text: "關於聯合勸募"},
      {name: "news", text: "最新消息"},
    ],
    cur_page: window.location.hash==""?default_page:window.location.hash.substr(1),
    index_talk: {
      cur_id: 0,
      cur_len: 0,
      data: [""]
    },
    footer_com: {},
    index_news: [],
    news_id: 0,
    now_showing_news: false,
    pic_mode: false,
    page_loading: !debug_mode,
    showing_chicken: false,
    showing_chicken_id: 1,
    showing_chkdata: [],
    about_servicedata:[
      {name:"身心障礙",count:116,money:62504097,people:198822},
      {name:"婦女",count:30,money:18999320,people:144383},
      {name:"家庭",count:58,money:34200509,people:620530},
      {name:"兒童",count:56,money:36274360,people:532293},
      {name:"老人",count:48,money:29607314,people:408760},
      {name:"青少年",count:47,money:27136263,people:588956},
      {name:"疾病患者",count:46,money:33727550,people:286355},
      {name:"社區居民",count:35,money:2384715,people:1517627},
      {name:"其他",count:65,money:50491741,people:5096820}
    ],
    chicken_egg_data:{
      now_id:0,
      datas:
      [
      {
        title: "意志力鬥士 智慧阿毛",
        img: "http://45.118.133.210/img/item_pic/IMG_0158.png",
        content: "擁有超強意志力的知識小百科<br>實用功能：安全守護鑰匙圈<br><br>聯合勸募扶助類型：身心障礙朋友"
      },{
        title: "熱情歌雞 阿猛老師",
        img: "http://45.118.133.210/img/item_pic/IMG_0178.png",
        content: "能歌善舞、開朗活潑<br>實用功能：唱歌跳舞捲線器<br><br>聯合勸募扶助類型：原住民朋友"
      },{
        title: "好奇寶寶 神奇小童",
        img: "http://45.118.133.210/img/item_pic/IMG_0184.png",
        content: "有問題絕對打破沙鍋問到底！<br>實用功能：好朋友杯緣子<br><br>聯合勸募扶助類型：兒童/青少年"
      },{
        title: "歡樂爺爺 Party 老爹",
        img: "http://45.118.133.210/img/item_pic/IMG_0174.png",
        content: "人見人愛的歡樂爺爺<br>實用功能：處處可吸磁力組<br><br>聯合勸募扶助類型：高齡長者"
      },{
        title: "食尚咕咕 廚神阿美",
        img: "http://45.118.133.210/img/item_pic/IMG_0166.png",
        content: "新「食」代美食專家<br>實用功能：海納百川迴紋針吸盤組<br><br>聯合勸募扶助類型：新住民婦女"
      }
    ]}
    
  },
  methods:{
    sw_page: function(target_page){
      
      
      //收合手機導覽列
      $(".normal_nav").removeClass("mnavopen");
      if (target_page.indexOf("url|")==0){
        window.open(target_page.substr(4));
        return 0;
      }
      
      //立即響應設定為導向聯勸網站
      if (target_page=="support"){
  window.open("https://www.unitedway.org.tw/civicrm/contribute/transact?reset=1&id=3");
        return 0;
      }
      //將page_support導向原先support分頁
      if (target_page=="page_support"){
        target_page="support";
      }
      
      
      //切換hash
      window.location.hash=target_page;
      
      
      //300ms 後切換頁面
      setTimeout(function(){
        vm.cur_page=target_page;
        $(".bluepiece").css("transform","");
        $(".yellowpiece").css("transform","");
        
        
        
        // for(var i=0;i<vm.page_list.length;i++){
        //   if (vm.page_list[i].name==target_page){
        //     history.pushState(vm.page_list[i], vm.page_list[i].text, vm.page_list[i].name);
        //   }
        // }
        
      },300);
      
      //700ms 後偵測畫面內容浮出
      setTimeout(function(){detect_show(0)},700);
      var body = $("html, body");
      body.stop().animate({scrollTop:0}, '500', 'swing', function() { 
      });
      
      //換對話
      if (target_page=="index"){
        this.index_talk.cur_id=parseInt(Math.random()*this.index_talk.data.length);
        this.index_talk.cur_len=0;
      }
        
      //切換頁的時候開loading效果
      this.page_loading=true;
      setTimeout(function(){
        vm.page_loading=false;
      },500);
      
      //add waiting bubble
      $(".page_content,.page_title").each(function(index,value){
        $(value).addClass("scroll_common");
        $(value).addClass("scroll_detecting");
        $(value).addClass("scroll_wait");
      });
      

      
    },
    show_news: function(id){
      //切換頁的時候開loading效果
      this.page_loading=true;
      setTimeout(function(){
        vm.page_loading=false;
      },500);
      setTimeout(function(){
        if (id==vm.news_id){
          if (vm.now_showing_news){
            vm.now_showing_news=false;
            // var body = $("html, body");
            // body.stop().animate({scrollTop:last_scroll_top}, '0', 'swing', function() { 
            // });
          }else{
            vm.now_showing_news=true;
            
          }
        }else{
          // last_scroll_top=$(window).scrollTop();
          vm.news_id=id;
          vm.now_showing_news=true;
        }
      },500);
      
      
    },
    jump_newspage: function(id){
      this.sw_page("news");
      this.show_news(id);
    },
    tick: function(){
      if (Math.random()>0.3)
        this.index_talk.cur_len++;  
    },
    sw_egg_pre: function(id){
      this.chicken_egg_data.now_id=id;
    }
  },
  ready: function(){
    this.index_talk.cur_id=parseInt(Math.random()*this.index_talk.data.length);
    
    // load data
    $.ajax({
      url: api_url+"A",
      success: function(res){
        // console.log(JSON.parse((""+res).trim()));
        vm.$set("footer_com",JSON.parse(res.index_footercom));
        vm.$set("index_news",JSON.parse(res.index_news));
        vm.$set("index_talk.data",JSON.parse(res.index_talk));
        
      }
    });
    $.ajax({
      url: api_url+"E",
      success: function(res){
        var data=JSON.parse(res.about_showing_chkdata);
        vm.$set("showing_chkdata",data);
        setTimeout(function(){
          preparechk(data);
        },1000);  
      }
    });
  }
});
setInterval(function(){
  vm.tick();
},100);

var global_time=0;
var target_deg=-90;
var current_deg=-90;
setInterval(function(){
  global_time++;
  $(".loading_egg").css("transform","rotate("+current_deg+"deg)");
  current_deg+=(target_deg-current_deg)*0.1;
  
  target_deg=-90+(global_time+Math.sin(global_time)/2);
  // else
  //   target_deg=5;
},10);

setTimeout(function(){
  vm.page_loading=false;
},1500);


var target_height=70;
var current_height=20;



function trace_val(){
  if (current_height<target_height){
    current_height+=20;
    if (current_height>target_height)
      current_height=target_height;
    $(".bar").css("height",current_height+"%");
    $(".bar_heart").css("transform","scale(1.5)");
    setTimeout(function(){$(".bar_heart").css("transform","scale(1)");},100);
    setTimeout(trace_val,800);
  }
}
setTimeout(trace_val,800);
setTimeout(function(){
  // $(".row_index .col_mid").css("transition","0.5s 0.3s");
  $(".row_index").removeClass("pic_mode");
},1000);



var mpos={x: 0,y: 0};
var wsize={width: $(window).width(),height: $(window).height()}
var current_page="activity";

$(window).mousemove(function(e){
  mpos.x=e.pageX;
  mpos.y=e.pageY;
  //village
  $(".village2").css("transform","translateX("+-(mpos.x-wsize.width/2)/20+"px)"); 
  $(".rab_chicken").css("transform","rotate("+(mpos.x-wsize.width/2)/-25+"deg)");
  
});



$(".page_content,.page_title").each(function(index,value){
  $(value).addClass("scroll_common");
  $(value).addClass("scroll_detecting");
  $(value).addClass("scroll_wait");
});

function detect_show(wstop){
  $(".scroll_detecting").each(function(index,value){
      var pan=20;
      if (mobile_mode) pan=-200;
      if ($(this).offset().top-$(window).height()+pan<wstop){
      $(this).removeClass("scroll_detecting");
      $(this).removeClass("scroll_wait");
    }
  });
}

setTimeout(function(){detect_show(wstop)},600);

wstop=$(window).scrollTop();
$(window).scroll(function(e){
    //scroll show
    wstop=$(window).scrollTop();
    detect_show(wstop);
  
    //village
    $(".village").css("transform","translateX(-"+wstop/8+"px)");
  
    //grass
    $(".grass").css("transform","translateX(-"+wstop/5+"px)");
  
    //table
    $(".table").css("transform","translateX("+wstop/8+"px)");
  
    //pieces
    if (vm.cur_page=="index" && !mobile_mode){  
      $(".bluepiece").css("transform","translateY("+wstop/10+"px) skewY(1.8deg)");
     $(".yellowpiece").css("transform","translateY("+wstop/20+"px) skewY(-4deg)");
    }else{
      $(".bluepiece").css("transform","");
      $(".yellowpiece").css("transform","");
      
    }

  
  //flying chk
   $(".flyingchicken").css("transform","translateY(-"+wstop/4+"px) rotate("+wstop/10+"deg)"); 
  
  //egg
  $(".egg1").css("transform","translateY("+(wstop/15-20)+"px) rotate("+wstop/10+"deg)"); 
  $(".egg4").css("transform","translateY("+(wstop/10-20)+"px) rotate("+wstop/10+"deg)"); 
  
   $(".egg2").css("transform","translateY("+(wstop/7-10)+"px) rotate("+wstop/5+"deg)"); 
   $(".egg3").css("transform","translateY("+(wstop/5-20)+"px) rotate(-"+wstop/8+"deg)"); 
  
  //circle
  $(".machine").css("transform","translateY("+(-20+wstop/10)+"px) rotate(-"+wstop/200+"deg)"); 
  
  //hearts
  $(".heart1").css("transform","translateX("+(wstop-800)/10+"px) translateY(-"+(wstop-800)/20+"px)  rotate(-"+wstop/200+"deg)"); 
  $(".heart2").css("transform","translateX("+(wstop-800)/8+"px) translateY(-"+(wstop-800)/8+"px)  rotate(-"+wstop/200+"deg)"); 
  
  $(".heart3").css("transform","translateX("+(wstop-800)/12+"px) translateY(-"+(wstop-800)/12+"px)  rotate(-"+wstop/200+"deg)"); 
  
  $(".heart4").css("transform","translateX("+(wstop-800)/15+"px) translateY(-"+(wstop-800)/15+"px)  rotate(-"+wstop/200+"deg)"); 
  
  $(".heart5").css("transform","translateX("+(wstop-800)/5+"px) translateY(-"+(wstop-800)/5+"px)  rotate(-"+wstop/200+"deg)"); 
  
  //hex
  $(".hex").css("transform","translateY("+(-20+(wstop-1200)/20)+"px) rotate(-"+(wstop-1200)/200+"deg)"); 
  
  //talk
   $(".talk").css("transform","rotate(-"+Math.sin(-wstop/50)*20+"deg) scale("+(1+Math.cos(wstop/50)/4)+")"); 
  
  //tri
  $(".tri").css("transform","translateY("+(-20+(wstop-1800)/20)+"px) rotate(-"+(wstop-1800)/70+"deg)"); 
  
  //eggall
  $(".allegg").css("transform","translateY("+(-20+(wstop-3000)/20)+"px) rotate("+(wstop-3000)/-30+"deg)"); 
  
  //rab chicken
  $(".rab_chicken").css("transform","rotate("+(mpos.x-wsize.width/2)/-25+"deg)");
  $(".rab_book").css("transform","translateY("+wstop/10+"px) rotate(-"+(wstop)/30+"deg)"); 


  


  
  //row ab
  
  
  $(".redline").css("transform","skewX(10deg) translateY("+wstop/-7+"px)"); 
  
  $(".ab_basket").css("transform","translateX("+(-120+wstop/5)+"px) translateY("+wstop/30+"px) rotate("+(wstop)/30+"deg)"); 
  
    if (!mobile_mode){
      $(".comic_block").each(
        function(index,value){
          $(value).css("transform","translateY(-"+(parseFloat($(value).attr("data-mul-speed")))*wstop/2+"px)");
        }
      );
    }
  
  //acegg_
  $(".acegg_hex").css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(wstop/120)*10+"deg) scale("+(1+Math.cos(wstop/120)/10)+") "); 
  $(".acegg_eggchk").css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(-wstop/120)*10+"deg) scale("+(1+Math.cos(wstop/120)/10)+") "); 

//acegg_m
  $(".acegg_machine").css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(wstop/150)*15+"deg) "); 
  $(".acegg_circle").css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(-wstop/150)*15+"deg)"); 
  
  
});




$(".comic_block").each(function(index,value){
  $(this).css("animation-delay",-(2*Math.random()+0.1)+"s");
});


// $("nal li").click(function(){
//   $(".web_body").addClass("page_index");
// });

$(".nav_home").click(function(){
  $(".web_body").removeClass("page_index");
});

$(".switches").each(function(index,value){
  var el_sw=value;
  console.log(el_sw);
  var cl=$(el_sw).children(".cleft");
  var cr=$(el_sw).children(".cright");
  var ff=$(el_sw).children(".container-fluid:first");
  
  function sw_page(delta){
    var cur_pos=parseInt($(ff).attr("data-pos"))+delta;
    var min_pos=parseInt($(ff).attr("data-range").split(",")[0]);
    var max_pos=parseInt($(ff).attr("data-range").split(",")[1]);
    
    if (cur_pos>max_pos) cur_pos=max_pos;
    if (cur_pos<min_pos) cur_pos=min_pos;
    
    ff.css("margin-left",-cur_pos*100+"%");
    $(ff).attr("data-pos",cur_pos);
  }
  
  cl.click(function(){
    sw_page(-1);
    
  });
  cr.click(function(){
    sw_page(1);
  });
  
});

// //page switch
// $(".main_index_content,.people").css("opacity","0");
// $(".row_index").css("min-height","150px");

var nodes=[];
function preparechk(chkdata){
  
  nodes=chkdata;
  var chkarea = d3.select("#chicken_activity"),
      chkarea_width = 500,
      chkarea_height = 400;
  
  for(var i=0;i<5;i++){
    chkdata[i].idx=i;
    chkdata[i].x= Math.random()*200;
    chkdata[i].y= Math.random()*200;
    chkdata[i].r= 100;
    // chkdata[i].img_url= "http://45.118.133.210/img/graphic-"+(37+i)+".svg"
  };
  var circles=chkarea.selectAll("div").data(nodes).enter().append("div")
  .style("width",function(d){return d.r+"px"})
  .style("height",function(d){return d.r+"px"})
  .style("background-image",function(d){return "url("+d.img_url+")"})
  .style("background-position","center center")
  .style("background-repeat","no-repeat")
  .attr("title","點我查看聯勸故事")
  .style("transform","translateX(-50%) translateY(-50%)")
  .style("left",function(d){return d.x})
  .style("top",function(d){return d.y})
  .attr("class","chk")
  .attr("data-index",function(d,i){return i;})
  .on("click",function(d,i){
    console.log("click!");
    window.open(vm.showing_chkdata[i].url);
  })
  .on("mouseenter", function(d,i) {
    d.r=150;
    simulation.force("node",d3.forceCollide(function(d){return d.r;}).strength(1))
    vm.showing_chicken=true;
    vm.showing_chicken_id=i;
  })
  .on("mouseleave", function(d,i) {
    d.r=100;
    simulation.force("node",d3.forceCollide(function(d){return d.r;}).strength(1))
    vm.showing_chicken=false;
    vm.showing_chicken_id=i;
  })
  .call(
    d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)

  );

  function ticked(){
    // console.log("tick!");
    circles.style("left", function(d) {return d.x+"px"});
    circles.style("top", function(d) {return d.y+"px"});
    circles.style("width",function(d){return d.r*1.7+"px"})
    circles.style("height",function(d){return d.r*1.7+"px"})
  }

  var simulation = d3.forceSimulation()
  .force("node",d3.forceCollide(function(d){return d.r;}).strength(1))
  .force("center",d3.forceCenter(chkarea_width/2,chkarea_height/2));

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  } 



  simulation
        .nodes(nodes)
        .on("tick", ticked);

  // simulation.stop();
  //  simulation.tick();
  setInterval(
    function(){
      simulation.alphaTarget(0.3).restart()
      nodes.forEach(function(value,index){
        if (index>0){
        value.vx+=(chkarea_width/2-value.x)*0.01;
         value.vy+=(chkarea_height/2-value.y)*0.01;
        }
      });
    }

    ,50);
}

$(".mobile_nav_toggle").click(function(){
  $(".normal_nav").toggleClass("mnavopen");
});