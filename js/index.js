var debug_mode=false;
var mobile_mode=false;
var api_url="http://45.118.133.210:8083/api/block/get/";
var default_page=debug_mode?"index":"index";
var last_scroll_top=0;
var ga_enable=!debug_mode && window.location.hostname=="citi2016.unitedway.org.tw";
var user_nav_sw_discard=false;

console.log("Monoame design @2016");

//建立ga物件
if (ga_enable){
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
  //建立ga使用者
  ga('create', 'UA-52977512-10', 'auto'); //墨雨
  ga('create', 'UA-10005421-24', 'auto' , 'clientTracker'); //廠商
  console.log("GA Enabled. Production Mode.");
}else{
  console.log("GA disabled. Testing Mode.");
}

//送出瀏覽資料
function ga_send(){
  if (ga_enable){
    ga('send', 'pageview',{ 'page': location.pathname + location.search + location.hash});
    ga('clientTracker.send', 'pageview',{ 'page': location.pathname + location.search + location.hash});
    console.log("GA log "+window.location.hash+" . [GA]");
  }else{
    console.log("Page visit log "+window.location.hash+" . [disable GA]");
  }
}

//如果進入點是ip，重新導向網址
if (window.location.hostname=="45.118.133.210"){
  window.location.href = window.location.href.replace("45.118.133.210","citi2016.unitedway.org.tw");
}

//如果hash改變，偵測並載入項目
window.onhashchange = function() {
  if (!user_nav_sw_discard){
    var target_page=window.location.hash.substr(1);
    if (target_page=="support"){
      target_page="page_support";
    }
    vm.sw_page(target_page);
  }else{
    user_nav_sw_discard=true;
  }
}

//如果畫面大小小於800就開啟手機模式js
if ($(window).width()<800){
  mobile_mode=true;
}

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
    page_loading: true,
    showing_chicken: false,
    showing_chicken_id: 1,
    showing_chkdata: [],
    about_servicedata:[],
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
      var sw_waittime=500;
      
      //收合手機導覽列
      $(".normal_nav").removeClass("mnavopen");
      if (target_page.indexOf("url|")==0){
        window.open(target_page.substr(4));
        return 0;
      }
      
      //設定切換hash抵銷額度1
      user_nav_sw_discard=true;
      
      //切換hash
      window.location.hash=target_page;
      
      ///重新導向news      
      if (target_page.indexOf("news@")!=-1){
         // console.log(target_page);
         this.news_id=parseInt(target_page.split("@")[1]);
         setTimeout(function(){
          vm.now_showing_news=true;
        },400);
         target_page="news";
      }else{
        setTimeout(function(){
          vm.now_showing_news=false;
        },400);
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
      
      //300ms 後切換頁面
      setTimeout(function(){
        vm.cur_page=target_page;
        $(".bluepiece").css("transform","");
        $(".yellowpiece").css("transform","");
        
        //送出ga資料
        ga_send();
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
      },sw_waittime);
      
      //加入當等待效果隱藏，滑到定位後去掉
      $(".page_content,.page_title").each(function(index,value){
        $(value).addClass("scroll_common");
        $(value).addClass("scroll_detecting");
        $(value).addClass("scroll_wait");
      });
      

      
    },
    show_news: function(id){ 
      vm.sw_page("news@"+id);
      // //切換頁的時候開loading效果
      // this.page_loading=true;
      // setTimeout(function(){
      //   vm.page_loading=false;
      // },500);
      // setTimeout(function(){
      //   if (id==vm.news_id){
      //     if (vm.now_showing_news){
      //       vm.now_showing_news=false;
      //     }else{
      //       vm.now_showing_news=true;
      //     }
      //   }else{
      //     vm.news_id=id;
      //     vm.now_showing_news=true;
      //   }
      // },500);
      
      
    },
    //跳到新聞頁
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
    
    function request_block(blockname,callback){
      // load data
      $.ajax({
        url: api_url+blockname,
        success: callback
      });
    }
    
    // load data
    request_block("A",function(res){
        vm.$set("footer_com",JSON.parse(res.index_footercom));
        vm.$set("index_news",JSON.parse(res.index_news));
        vm.$set("index_talk.data",JSON.parse(res.index_talk));
    });
    request_block("D",function(res){
        vm.$set("about_servicedata",JSON.parse(res.about_servicedata));
    });
    request_block("E",function(res){
        var data=JSON.parse(res.about_showing_chkdata);
        vm.$set("showing_chkdata",data);
        setTimeout(function(){
          preparechk(data);
        },1000);  
    });
    
    if (window.location.hash!="#index" && window.location.hash!=""){
      //設定切換hash抵銷額度1
      user_nav_sw_discard=true;
      //重新導向網站
      this.sw_page(window.location.hash==""?default_page:window.location.hash.substr(1));
    }else{
      ga_send();
    }
    
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
  target_deg=-90+(global_time+Math.sin(global_time)/2)
},10);

setTimeout(function(){
  vm.page_loading=false;
},2000);
if (debug_mode){
  setTimeout(function(){
    vm.page_loading=false;
  },500);
}

//首頁的愛心能量條
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

////關閉圖片模式
// setTimeout(function(){
//   // $(".row_index .col_mid").css("transition","0.5s 0.3s");
//   $(".row_index").removeClass("pic_mode");
// },1000);


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

var village = $(".village");
var grass = $(".grass");
var table = $(".table");
var bluepiece=$(".bluepiece");
var yellowpiece=$(".yellowpiece");
var machine= $(".machine");
var hearts=[$(".heart1"),$(".heart2"),$(".heart3"),$(".heart4"),$(".heart5")];

var flyingchicken=$(".flyingchicken");
var eggs=[$(".egg1"),$(".egg2"),$(".egg3"),$(".egg4")];

var hex=$(".hex");
var talk=$(".talk");
var tri=$(".tri");
var allegg=$(".allegg");
var rab_chicken=$(".rab_chicken");
var rab_book=$(".rab_book");
var redline=$(".redline");
var ab_basket=$(".ab_basket");
var acegg_hex=$(".acegg_hex");
var acegg_eggchk=$(".acegg_eggchk");
var acegg_machine=$(".acegg_machine");
var acegg_circle=$(".acegg_circle");

var row_ab= $(".row_ab");

// function trantemp(template,inject){
//   var	str = template;
//   var res = str.replace(/\#/i, "(wstop/"+inject+")");
//   return template.
// }
(function scroll_actions(){
$(window).scroll(function(e){
    //scroll show
    wstop=$(window).scrollTop();
    detect_show(wstop);

    //village
    village.css("transform","scale(1.1) translateX("+wstop/-10+"px)");
    //grass
    grass.css("transform","translateX("+wstop/-5+"px)"); 
    //table
    table.css("transform","translateX("+wstop/8+"px)");

    //pieces
    if (vm.cur_page=="index" && !mobile_mode){  
      bluepiece.css("transform","translateY("+wstop/10+"px) skewY(1.8deg)");
      yellowpiece.css("transform","translateY("+wstop/20+"px) skewY(-4deg)");
    }else{
      bluepiece.css("transform","");
      yellowpiece.css("transform","");
    }

    //flying chk
   flyingchicken.css("transform","translateY(-"+wstop/4+"px) rotate("+wstop/10+"deg)"); 

    //egg
    eggs[0].css("transform","translateY("+(wstop/15-20)+"px) rotate("+wstop/10+"deg)"); 
    eggs[3].css("transform","translateY("+(wstop/10-20)+"px) rotate("+wstop/10+"deg)"); 
    eggs[1].css("transform","translateY("+(wstop/7-10)+"px) rotate("+wstop/5+"deg)"); 
    eggs[2].css("transform","translateY("+(wstop/5-20)+"px) rotate(-"+wstop/8+"deg)"); 

    //circle
    machine.css("transform","translateY("+(-20+wstop/10)+"px) rotate(-"+wstop/200+"deg)"); 

    //hearts
    hearts[0].css("transform","translateX("+(wstop-800)/10+"px) translateY(-"+(wstop-800)/20+"px)  rotate(-"+wstop/200+"deg)"); 
    hearts[1].css("transform","translateX("+(wstop-800)/8+"px) translateY(-"+(wstop-800)/8+"px)  rotate(-"+wstop/200+"deg)"); 
    hearts[2].css("transform","translateX("+(wstop-800)/12+"px) translateY(-"+(wstop-800)/12+"px)  rotate(-"+wstop/200+"deg)"); 
    hearts[3].css("transform","translateX("+(wstop-800)/15+"px) translateY(-"+(wstop-800)/15+"px)  rotate(-"+wstop/200+"deg)"); 
    hearts[4].css("transform","translateX("+(wstop-800)/5+"px) translateY(-"+(wstop-800)/5+"px)  rotate(-"+wstop/200+"deg)"); 


    //hex
    hex.css("transform","translateY("+(-20+(wstop-1200)/20)+"px) rotate(-"+(wstop-1200)/200+"deg)"); 
    //talk
    talk.css("transform","rotate(-"+Math.sin(-wstop/50)*20+"deg) scale("+(1+Math.cos(wstop/50)/4)+")"); 
    //tri
    tri.css("transform","translateY("+(-20+(wstop-1800)/20)+"px) rotate(-"+(wstop-1800)/70+"deg)"); 

    //eggall
    allegg.css("transform","translateY("+(-20+(wstop-3000)/20)+"px) rotate("+(wstop-3000)/-30+"deg)"); 

    //rab chicken
    rab_chicken.css("transform","rotate("+(mpos.x-wsize.width/2)/-25+"deg)");
    rab_book.css("transform","translateY("+wstop/10+"px) rotate(-"+(wstop)/30+"deg)"); 
    //row ab
    redline.css("transform","skewX(10deg) translateY("+wstop/-7+"px)"); 
    ab_basket.css("transform","translateX("+(-120+wstop/5)+"px) translateY("+wstop/30+"px) rotate("+(wstop)/30+"deg)"); 

      if (!mobile_mode){
        $(".comic_block").each(
          function(index,value){
            $(value).css("transform","translateY(-"+(parseFloat($(value).attr("data-mul-speed")))*wstop/2+"px)");
          }
        );
      }


    //acegg_
    acegg_hex.css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(wstop/120)*10+"deg) scale("+(1+Math.cos(wstop/120)/10)+") "); 
    acegg_eggchk.css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(-wstop/120)*10+"deg) scale("+(1+Math.cos(wstop/120)/10)+") "); 

  //acegg_m
    acegg_machine.css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(wstop/150)*15+"deg) "); 
    acegg_circle.css("transform","translateX(-50%) translateY(-50%) rotate("+Math.sin(-wstop/150)*15+"deg)"); 

    if (wstop<800){
      var mh=(500-wstop/2);
      if (mh<0)mh=0;
      row_ab.css("height",mh+"px");
      row_ab.css("min-height",mh+"px");
    }
    
  });
})();
$(".comic_block").each(function(index,value){
  $(this).css("animation-delay",-(2*Math.random()+0.1)+"s");
});

// $(".switches").each(function(index,value){
//   var el_sw=value;
//   console.log(el_sw);
//   var cl=$(el_sw).children(".cleft");
//   var cr=$(el_sw).children(".cright");
//   var ff=$(el_sw).children(".container-fluid:first");
  
//   function sw_page(delta){
//     var cur_pos=parseInt($(ff).attr("data-pos"))+delta;
//     var min_pos=parseInt($(ff).attr("data-range").split(",")[0]);
//     var max_pos=parseInt($(ff).attr("data-range").split(",")[1]);
    
//     if (cur_pos>max_pos) cur_pos=max_pos;
//     if (cur_pos<min_pos) cur_pos=min_pos;
    
//     ff.css("margin-left",-cur_pos*100+"%");
//     $(ff).attr("data-pos",cur_pos);
//   }
  
//   cl.click(function(){
//     sw_page(-1);
    
//   });
//   cr.click(function(){
//     sw_page(1);
//   });
  
// });


$(".mobile_nav_toggle").click(function(){
  $(".normal_nav").toggleClass("mnavopen");
});

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


var scene=document.querySelector(".mch1");

// $("#mchscene").css({
//   position: "fixed",
//   width: "100vw",
//   height: "70vh",
//   left: "0px",
//   top: "10vh",
//   "z-index": "20000"
// });

// setTimeout(function(){
//   $("#mchscene").css({
//     position: "",
//     width: "",
//     height: "",
//     left: "",
//     top: "",
//     "z-index": ""
//   });
// },6000);


var cm1=document.querySelector("#comic_block1");
var cm2=document.querySelector("#comic_block2");
var cm3=document.querySelector("#comic_block3");
var cm4=document.querySelector("#comic_block4");

var ctm=new TimelineMax({delay: 0});
ctm.to(cm1,2,{
  css:{
    y: -80
  }
}).to(cm1,1.5,{
  css:{
    y: 0
  }
});
var ctm2=new TimelineMax({delay: 0});
ctm2.to(cm2,2,{
  css:{
    y: 80
  }
}).to(cm2,1.5,{
  css:{
    y: 0
  }
});


  $.ajax({
    url: "http://45.118.133.210/img/scene/command.php?type=get&name=scene_index",
    success: function(res){
      var result=res;
      $(".village").html(res);
      $(".village").children("svg").attr("id","scene_index");
       $("#index_sceneinner").css("transform","scale(1.2)");
      
      
       house1=$("#scene_index #house1");
       house2=$("#scene_index #house2");
       houses=[house1,house2];
       mch.init();
      
      
      
    }
  });  

var mch1=document.querySelector(".mch1");
var mch2=document.querySelector(".mch3");
var mch3=document.querySelector(".mch5");
var mch4=document.querySelector(".mch6");

var mchs=[mch1,mch2,mch3,mch4];

// var tMax = new TimelineMax({delay:1});
var tmm=new TimelineMax;
var mch={
  init: function(){
    var t1=new TimelineMax({delay: 2});
    t1.from(mch2,1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(mch2,0.4,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });

    var t2=new TimelineMax({delay: 2+0.5});
    t2.from(mch1,1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(mch1,0.4,{
      css:{x:0,bottom:50,rotation: 10},
      ease: Power1.easeOut
    }).to(mch1,0.4,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });

    var t3=new TimelineMax({delay: 2+0.7});
    t3.from(mch3,1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(mch3,0.4,{
      css:{x:0,bottom:50,rotation: 10},
      ease: Power1.easeOut
    }).to(mch3,0.4,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });

    var t4=new TimelineMax({delay: 2+0.1});
    t4.from(mch4,1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(mch4,0.4,{
      css:{x:0,bottom:50,rotation: 10},
      ease: Power1.easeOut
    }).to(mch4,0.4,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });
    
    
    var t5=new TimelineMax({delay: 2});
    t5.from(houses[0],1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(houses[0],5,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });
    
    var t6=new TimelineMax({delay: 2.5});
    t6.from(houses[1],1,{
      css:{x:0,bottom:-200,rotation: 0},
      ease: Power1.easeOut
    }).to(houses[1],5,{
      css:{x:0,bottom:0,rotation: 0},
      ease: Power1.easeIn
    });
    
     tmm.add(t5,0);
     tmm.add(t6,0);
    
    tmm.add(t1,0);
    tmm.add(t2,0);
    tmm.add(t3,0);
    tmm.add(t4,0);
  
  }
};




function active_chk(){
  var t1=new TimelineMax;
  t1.to(mch2,0.4,{
    css:{x:0,bottom:50,rotation: 0},
    ease: Power1.easeOut
  }).to(mch2,0.4,{
    css:{x:0,bottom:0,rotation: 0},
    ease: Power1.easeIn
  });
  
  var t2=new TimelineMax({delay: 0.5});
  t2.to(mch1,0.4,{
    css:{x:0,bottom:50,rotation: 10},
    ease: Power1.easeOut
  }).to(mch1,0.4,{
    css:{x:0,bottom:0,rotation: 0},
    ease: Power1.easeIn
  });
  
  var t3=new TimelineMax({delay: 0.7});
  t3.to(mch3,0.4,{
    css:{x:0,bottom:10,rotation: 10,skewX: 2},
    ease: Power1.easeOut
  }).to(mch3,0.4,{
    css:{x:0,bottom:0,rotation: 0,skewX: 0},
    ease: Power1.easeIn
  });
  
  var t4=new TimelineMax({delay: 0.1});
  t4.to(mch4,0.3,{
    css:{x:0,rotationY:180,rotation: 10},
    ease: Power1.easeOut
  }).to(mch4,0.8,{
    css:{x: -30},
    ease: Power1.easeOut
  }).to(mch4,0.3,{
    css:{x:0,rotationY:0,rotation: 0},
    ease: Power1.easeIn
  }).to(mch4,0.8,{
    css:{x: 30},
    ease: Power1.easeOut
  });
  
}

$("#comic_block3").mouseenter(active_chk);

setInterval(active_chk,4000);