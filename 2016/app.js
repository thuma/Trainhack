var eventService=new EventService,isSsl=!1,isShowingTVGuide=!0,timeOutChannels,tabFocus,hidden,refreshTime=3e5,refreshTimeUpdated=!1;if("IE"==eventService.userAgent.browser.name&&eventService.userAgent.browser.version<=9){player.debug&&(console.log("debug: Browser IE "+eventService.browser.version),console.log("debug: Adding xdomain slaves"));var slaves={};slaves[player.liveEventsResourceUrl]="/proxy.html",slaves[player.securityResourceUrl]="/proxy.html",slaves[player.statisticsResourceUrl]="/proxy.html",slaves[player.deliveryResourceUrl]="/proxy.html",slaves[player.vodResourceUrl]="/proxy.html",slaves[player.channelResourceUrl]="/proxy.html",xdomain.slaves(slaves),xdomain.debug=!0}window.onload=function(){player.debug&&(console.log("debug: web page completed loading all content"),console.log("debug: state: "+playerHandler.state),console.log("debug: app.start")),isSsl="https:"===window.location.protocol,hidden in document?document.addEventListener("visibilitychange",app.onTabFocusChange):(hidden="mozHidden")in document?document.addEventListener("mozvisibilitychange",app.onTabFocusChange):(hidden="webkitHidden")in document?document.addEventListener("webkitvisibilitychange",app.onTabFocusChange):(hidden="msHidden")in document?document.addEventListener("msvisibilitychange",app.onTabFocusChange):"ondomfocusin"in document?document.ondomfocusout=document.ondomfocusin=app.onTabFocusChange:window.onpageshow=window.onpagehide=window.onfocus=window.onblur=app.onTabFocusChange,void 0!==document[hidden]&&app.onTabFocusChange({type:document[hidden]?"blur":"focus"}),player.channelPrograms?(eventService.isChannel=!0,app.startChannel()):document.getElementById("MainContainer")&&app.start()},$(window).resize(function(){eventService.isBookMarksOpen&&$(document).ready(function(){$("#BookmarksData").jScrollPane()})});var app={start:function(){if(display.fillDomElements(),display.hideAll(),eventService.setEventData(),eventService.isLive&&eventService.getCurrentStatus(),player.autoPlay||display.setUpBanner(),eventService.isChannel)playerHandler.state!==playerState.showingBanner&&playerHandler.playerInit();else if(eventService.event.isPublished)if(eventService.isLive)if(player.preview)player.autoPlay&&playerHandler.playerInit();else switch(eventService.event.status){case eventStatusType.notScheduled:elBanner.visible(!1),elBackgroundImage.setAttribute("src",player.errorBgJPG),document.getElementById("EventNotScheduledMessage").innerText="Coming Soon",elNotScheduled.visible(!0);break;case eventStatusType.notStarted:display.addCountdownBg(),elBanner.visible(!1),elNotStarted.visible(!0),display.countdownTimer();break;case eventStatusType.started:display.isShowingInstaller||playerHandler.state===playerState.showingBanner||playerHandler.playerInit();break;case eventStatusType.completed:var e=window.location.href.replace("live/","vod/");e+=-1!=e.indexOf("?")?"&liveendedredirect=true":"?liveendedredirect=true",window.location.href=e;break;case eventStatusType.cancelled:elBanner.visible(!1),elBackgroundImage.setAttribute("src",player.errorBgJPG),document.getElementById("EventNotScheduledMessage").innerText="Event has been cancelled",elNotScheduled.visible(!0)}else playerHandler.state!==playerState.showingBanner&&playerHandler.playerInit();else player.liveendedredirect||player.isAdminPortal?player.liveendedredirect&&(display.hideAll(),display.showMessage("This broadcast has ended and will be available on demand shortly."),setTimeout(function(){document.location=window.location.href},3e4)):(display.hideAll(),display.showError({message:errorMessages.videoNotAvailable}))},startChannel:function(){display.fillTVGuideElements(),player.currentShowing?(player.currentShowing.is_live?eventService.isLive=!0:eventService.isLive=!1,isShowingTVGuide=!1,player.upcomingChannelPrograms.splice(0,1),player.autoPlay="true",app.start()):(display.setChannelImage(),isShowingTVGuide=!0,player.upcomingChannelPrograms.length>0?(display.displayUpcomingPrograms(),app.updateRefreshTimeIfRequired()):display.displayNoUpcomingPrograms()),refreshTimeUpdated&&(eventService.channelRefreshTime=refreshTime,refreshTimeUpdated=!1),timeOutChannels=setTimeout(app.updateChannelSchedule,eventService.channelRefreshTime)},updateChannelSchedule:function(){playerHandler.updateChannelPrograms()},updateDisplayOnTvGuide:function(){var e=Q.defer(),n=!1;clearTimeout(timeOutChannels),null===player.currentShowing||void 0===player.currentShowing?(isShowingTVGuide=!0,display.setChannelImage(),player.upcomingChannelPrograms.length>0?(display.hidePlayerBanner(),display.displayUpcomingPrograms(),app.updateRefreshTimeIfRequired()):(display.hidePlayerBanner(),display.displayNoUpcomingPrograms())):(player.eventId!=player.currentShowing.content_id||isShowingTVGuide)&&(n=!0,display.hideTVGuide(),display.hidePlayerBanner(),app.switchToNextProgram()),n||(refreshTimeUpdated&&(eventService.channelRefreshTime=refreshTime,refreshTimeUpdated=!1),timeOutChannels=setTimeout(app.updateChannelSchedule,eventService.channelRefreshTime),e.resolve())},switchToNextProgram:function(){var e=Q.defer();clearTimeout(timeOutChannels),console.log("Current program after switch :"+player.currentShowing.name+" at "+moment().format()),player.eventId=player.currentShowing.content_id,player.currentShowing.is_live?eventService.isLive=!0:eventService.isLive=!1,$.each(player.authorizationKeys,function(n,a){if(a.videoId===player.eventId){var r=a;eventService.getEvent(r).then(function(){player.autoPlay="true",player.upcomingChannelPrograms.splice(0,1),app.start(),e.resolve()}).catch(function(n){display.showError({log:"Error: "+n,message:"Error: "+n}),e.reject(n)})}}),isShowingTVGuide=!1,timeOutChannels=setTimeout(app.updateChannelSchedule,eventService.channelRefreshTime),e.resolve()},updateRefreshTimeIfRequired:function(){var e=moment(player.upcomingChannelPrograms[0].start_time),n=moment(),a=e.diff(n,"seconds");a<300?(refreshTimeUpdated=!0,refreshTime=1e3*(a+1)):refreshTimeUpdated=!1},onTabFocusChange:function(e){var n={focus:!0,focusin:!0,pageshow:!0,blur:!1,focusout:!1,pagehide:!1};e=e||window.event,tabFocus=e.type in n?n[e.type]:!this[hidden],countdownEnded&&playerHandler.state==playerState.notInitialized&&playerHandler.playerInit()}};