!function(){"use strict";function s(){var t=new Date;return t.getMilliseconds()/1e3+t.getSeconds()+60*t.getMinutes()}let a=new class{constructor(){this.start=this.old=this.oldFPS=s(),this.paused=0,this.frameCounter=0,this.FPS=30,this.global=0,this.globalDelta=0,this.local=0,this.localDelta=0,this.isPaused=!1}response(){var t=s();this.global=t-this.start,this.globalDelta=t-this.old,this.isPaused?(this.localDelta=0,this.paused+=t-this.old):(this.localDelta=this.globalDelta,this.local=this.global-this.paused),this.frameCounter++,1<t-this.oldFPS&&(this.FPS=this.frameCounter/(t-this.oldFPS),this.oldFPS=t,this.frameCounter=0),this.old=t}};let o=new class{constructor(){this.mx=0,this.my=0,this.mdx=0,this.mdy=0,this.mdz=0,this.mL=0,this.mR=0,this.wasInput=!1}handleEvent(t){switch(t.type){case"mouseup":t.preventDefault(),0==t.button?this.mL=0:this.mR=0;break;case"mousedown":t.preventDefault(),0==t.button?this.mL=1:this.mR=1;break;case"wheel":t.preventDefault(),this.mdz=t.deltaY/10;break;default:this.mdx=this.mx-t.clientX,this.mdy=this.my-t.clientY,this.mx=t.clientX,this.my=t.clientY}this.mdx*=-1,this.mdy*=-1,this.wasInput=!0}update(){this.wasInput?this.wasInput=!1:(this.mdx=0,this.mdy=0,this.mdz=0)}inputsOut(){console.log([this.mx,this.my,this.mdx,this.mdy].join(" : "))}};var i="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 in_pos;in vec3 in_norm;out vec3 vs_Pos;out vec3 vs_Norm;out vec4 vs_Color;void main(void){gl_Position=MatrWVP*vec4(in_pos,1.0);vs_Pos=(MatrW*vec4(in_pos,1.0)).xyz;vs_Norm=mat3(MatrW)*in_norm;vs_Color=vec4(0.6,0.8,0.9,1.0);}",e="#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 vs_Pos;in vec3 vs_Norm;in vec4 vs_Color;out vec4 outColor;void main(void){vec3 L=normalize(vec3(0.0,1.0,0.5));vec3 LC=vec3(1.0);vec3 Ka=vec3(0.1);vec3 Kd=vs_Color.xyz;vec3 Ks=vec3(0.8);float Ph=1.0;vec3 V=normalize(vs_Pos-CamPos.xyz);vec3 color=min(vec3(0.1),Ka);vec3 N=faceforward(vs_Norm,V,vs_Norm);color+=max(0.0,dot(N,L))*Kd*LC;vec3 R=reflect(V,N);color+=pow(max(0.0,dot(R,L)),Ph)*Ks*LC;outColor=vec4(color,1.0);}";let l,n;var t=document.getElementById("glCanvas");function r(t,s){t=l.createShader(t);return l.shaderSource(t,s),l.compileShader(t),l.getShaderParameter(t,l.COMPILE_STATUS)||(s=l.getShaderInfoLog(t),console.log("Compiling error:"),console.log(s)),t}function h(t,s,a,h,i,e,n,r,o){return t*i*o+s*e*n+a*h*r-a*i*n-s*h*o-t*e*r}l=t.getContext("webgl2");const u=3.14159265358979;function w(t){return t*(u/180)}function c(t){return t/u*180}class m{constructor(t,s,a,h,i,e,n,r,o,l,u,w,c,m,d,M){this.a=[],this.a[0]=[],this.a[1]=[],this.a[2]=[],this.a[3]=[],"object"==typeof t?(this.a[0][0]=t.a[0][0],this.a[0][1]=t.a[0][1],this.a[0][2]=t.a[0][2],this.a[0][3]=t.a[0][3],this.a[1][0]=t.a[1][0],this.a[1][1]=t.a[1][1],this.a[1][2]=t.a[1][2],this.a[1][3]=t.a[1][3],this.a[2][0]=t.a[2][0],this.a[2][1]=t.a[2][1],this.a[2][2]=t.a[2][2],this.a[2][3]=t.a[2][3],this.a[3][0]=t.a[3][0],this.a[3][1]=t.a[3][1],this.a[3][2]=t.a[3][2],this.a[3][3]=t.a[3][3]):null!=t&&null==s?(this.a[0][0]=t,this.a[0][1]=t,this.a[0][2]=t,this.a[0][3]=t,this.a[1][0]=t,this.a[1][1]=t,this.a[1][2]=t,this.a[1][3]=t,this.a[2][0]=t,this.a[2][1]=t,this.a[2][2]=t,this.a[2][3]=t,this.a[3][0]=t,this.a[3][1]=t,this.a[3][2]=t,this.a[3][3]=t):null==t?(this.a[0][0]=1,this.a[0][1]=0,this.a[0][2]=0,this.a[0][3]=0,this.a[1][0]=0,this.a[1][1]=1,this.a[1][2]=0,this.a[1][3]=0,this.a[2][0]=0,this.a[2][1]=0,this.a[2][2]=1,this.a[2][3]=0,this.a[3][0]=0,this.a[3][1]=0,this.a[3][2]=0,this.a[3][3]=1):(this.a[0][0]=t,this.a[0][1]=s,this.a[0][2]=a,this.a[0][3]=h,this.a[1][0]=i,this.a[1][1]=e,this.a[1][2]=n,this.a[1][3]=r,this.a[2][0]=o,this.a[2][1]=l,this.a[2][2]=u,this.a[2][3]=w,this.a[3][0]=c,this.a[3][1]=m,this.a[3][2]=d,this.a[3][3]=M)}set(t,s,a,h,i,e,n,r,o,l,u,w,c,m,d,M){return"object"==typeof t?(this.a[0][0]=t.a[0][0],this.a[0][1]=t.a[0][1],this.a[0][2]=t.a[0][2],this.a[0][3]=t.a[0][3],this.a[1][0]=t.a[1][0],this.a[1][1]=t.a[1][1],this.a[1][2]=t.a[1][2],this.a[1][3]=t.a[1][3],this.a[2][0]=t.a[2][0],this.a[2][1]=t.a[2][1],this.a[2][2]=t.a[2][2],this.a[2][3]=t.a[2][3],this.a[3][0]=t.a[3][0],this.a[3][1]=t.a[3][1],this.a[3][2]=t.a[3][2],this.a[3][3]=t.a[3][3]):null!=t&&null==s?(this.a[0][0]=t,this.a[0][1]=t,this.a[0][2]=t,this.a[0][3]=t,this.a[1][0]=t,this.a[1][1]=t,this.a[1][2]=t,this.a[1][3]=t,this.a[2][0]=t,this.a[2][1]=t,this.a[2][2]=t,this.a[2][3]=t,this.a[3][0]=t,this.a[3][1]=t,this.a[3][2]=t,this.a[3][3]=t):null==t?(this.a[0][0]=1,this.a[0][1]=0,this.a[0][2]=0,this.a[0][3]=0,this.a[1][0]=0,this.a[1][1]=1,this.a[1][2]=0,this.a[1][3]=0,this.a[2][0]=0,this.a[2][1]=0,this.a[2][2]=1,this.a[2][3]=0,this.a[3][0]=0,this.a[3][1]=0,this.a[3][2]=0,this.a[3][3]=1):(this.a[0][0]=t,this.a[0][1]=s,this.a[0][2]=a,this.a[0][3]=h,this.a[1][0]=i,this.a[1][1]=e,this.a[1][2]=n,this.a[1][3]=r,this.a[2][0]=o,this.a[2][1]=l,this.a[2][2]=u,this.a[2][3]=w,this.a[3][0]=c,this.a[3][1]=m,this.a[3][2]=d,this.a[3][3]=M),this}matrTranslate(t){return new m(1,0,0,0,0,1,0,0,0,0,1,0,t.x,t.y,t.z,1)}matrScale(t){return new m(t.x,0,0,0,0,t.y,0,0,0,0,t.z,0,0,0,0,1)}mulMatr(t){var s=new m(0);let a,h,i;for(a=0;a<4;a++)for(h=0;h<4;h++)for(i=0;i<4;i++)s.a[a][h]+=this.a[a][i]*t.a[i][h];return s}matrTranspose(){return new m(this.a[0][0],this.a[1][0],this.a[2][0],this.a[3][0],this.a[0][1],this.a[1][1],this.a[2][1],this.a[3][1],this.a[0][2],this.a[1][2],this.a[2][2],this.a[3][2],this.a[0][3],this.a[1][3],this.a[2][3],this.a[3][3])}determ(){return this.a[0][0]*h(this.a[1][1],this.a[1][2],this.a[1][3],this.a[2][1],this.a[2][2],this.a[2][3],this.a[3][1],this.a[3][2],this.a[3][3])-this.a[0][1]*h(this.a[1][0],this.a[1][2],this.a[1][3],this.a[2][0],this.a[2][2],this.a[2][3],this.a[3][0],this.a[3][2],this.a[3][3])+this.a[0][2]*h(this.a[1][0],this.a[1][1],this.a[1][3],this.a[2][0],this.a[2][1],this.a[2][3],this.a[3][0],this.a[3][1],this.a[3][3])-this.a[0][3]*h(this.a[1][0],this.a[1][1],this.a[1][2],this.a[2][0],this.a[2][1],this.a[2][2],this.a[3][0],this.a[3][1],this.a[3][2])}matrView(t,s,a){var s=s.sub(t).norm(),a=s.cross(a).norm(),h=a.cross(s);return new m(a.x,h.x,-s.x,0,a.y,h.y,-s.y,0,a.z,h.z,-s.z,0,-t.dot(a),-t.dot(h),t.dot(s),1)}matrFrustrum(t,s,a,h,i,e){return new m(2*i/(s-t),0,0,0,0,2*i/(h-a),0,0,(s+t)/(s-t),(h+a)/(h-a),-(e+i)/(e-i),-1,0,0,-2*i*e/(e-i),0)}toArray(){var a=[];for(let s=0;s<4;s++)for(let t=0;t<4;t++)a.push(this.a[s][t]);return a}matrRotateX(t){var t=w(t),s=Math.sin(t),t=Math.cos(t);return new m(1,0,0,0,0,t,s,0,0,-s,t,0,0,0,0,1)}matrRotateY(t){var t=w(t),s=Math.sin(t),t=Math.cos(t);return new m(t,0,-s,0,0,1,0,0,s,0,t,0,0,0,0,1)}matrRotateZ(t){var t=w(t),s=Math.sin(t),t=Math.cos(t);return new m(t,s,0,0,-s,t,0,0,0,0,1,0,0,0,0,1)}rotX(t){return this.set(this.mulMatr(this.matrRotateX(t)))}rotY(t){return this.set(this.mulMatr(this.matrRotateY(t)))}rotZ(t){return this.set(this.mulMatr(this.matrRotateZ(t)))}}class d{constructor(t,s,a){return null==t?(this.x=0,this.y=0,this.z=0):"object"==typeof t?(this.x=t.x,this.y=t.y,this.z=t.z):null==s?(this.x=t,this.y=t,this.z=t):(this.x=t,this.y=s,this.z=a),this}set(t,s,a){return null==t?(this.x=0,this.y=0,this.z=0):"object"==typeof t?(this.x=t.x,this.y=t.y,this.z=t.z):null==s?(this.x=t,this.y=t,this.z=t):(this.x=t,this.y=s,this.z=a),this}add(t,s,a){return"object"==typeof t?new d(this.x+t.x,this.y+t.y,this.z+t.z):null!=t&&null!=s&&null!=a?new d(this.x+t,this.y+s,this.z+a):null!=t?new d(this.x+t,this.y+t,this.z+t):new d(this)}sub(t,s,a){return"object"==typeof t?new d(this.x-t.x,this.y-t.y,this.z-t.z):null!=t&&null!=s&&null!=a?new d(this.x-t,this.y-s,this.z-a):null!=t?new d(this.x-t,this.y-t,this.z-t):new d(this)}mulNum(t){return null==t||"number"!=typeof t?new d(this):new d(this.x*t,this.y*t,this.z*t)}divNum(t){return null==t||"number"!=typeof t?new d(this):new d(this.x/t,this.y/t,this.z/t)}neg(){return new d(-this.x,-this.y,-this.z)}dot(t,s,a){return"object"==typeof t?this.x*t.x+this.y*t.y+this.z*t.z:null!=t&&null!=s&&null!=a?this.x*t+this.y*s+this.z*a:null!=t?this.x*t+this.y*t+this.z*t:this}cross(t,s,a){return"object"==typeof t?new d(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x):null!=t&&null!=s&&null!=a?new d(this.y*a-this.z*s,this.z*t-this.x*a,this.x*s-this.y*t):null!=t?new d(this.y*t-this.z*t,this.z*t-this.x*t,this.x*t-this.y*t):new d(0)}len2(){return this.dot(this)}len(){return Math.sqrt(this.dot(this))}norm(){var t=this.dot(this);return 1==t||0==t?this:this.divNum(Math.sqrt(t))}pointTransfrom(t){return new d(this.x*t.a[0][0]+this.y*t.a[1][0]+this.z*t.a[2][0]+ +t.a[3][0],this.x*t.a[0][1]+this.y*t.a[1][1]+this.z*t.a[2][1]+ +t.a[3][1],this.x*t.a[0][2]+this.y*t.a[1][2]+this.z*t.a[2][2]+ +t.a[3][2])}}let M=new class{configMatr=()=>{let t=this.projSize,s=this.projSize;l.canvas.width>l.canvas.height?t*=l.canvas.width/l.canvas.height:s*=l.canvas.height/l.canvas.width,this.matrV=this.matrV.matrView(this.loc,this.at,this.up),this.matrP=this.matrP.matrFrustrum(-t/2,t/2,-s/2,s/2,this.projDist,this.projFarClip),this.matrVP=this.matrV.mulMatr(this.matrP)};constructor(t,s,a){this.loc=null!=t?new d(t):new d(0,0,10),this.at=null!=s?new d(s):new d(0),this.up=null!=a?new d(a):new d(0,1,0),this.matrV=new m,this.matrP=new m,this.matrVP=new m,this.projDist=1,this.projSize=1,this.projFarClip=3e6,this.configMatr()}set(t,s,a){null!=t?this.loc.set(t):this.loc.set(0,0,10),null!=s?this.at.set(s):this.at.set(0),null!=a?this.up.set(a):this.up.set(0,1,0),this.configMatr()}move(){var e=this.at.sub(this.loc).len(),n=(this.loc.y-this.at.y)/e,r=Math.sqrt(1-n*n),t=e*r,s=(this.loc.z-this.at.z)/t,t=(this.loc.x-this.at.x)/t,t=c(Math.atan2(t,s)),s=c(Math.atan2(r,n));if(t+=a.globalDelta*(-60*o.mL*o.mdx),s+=a.globalDelta*(-60*o.mL*o.mdy),s=Math.min(Math.max(.01,s),177.99),e+=8*a.globalDelta*o.mdz,e=Math.max(e,.1),1==o.mR){let t,s,a,h,i;t=this.projSize,s=this.projSize,l.canvas.width>l.canvas.height?t*=l.canvas.width/l.canvas.height:s*=l.canvas.height/l.canvas.width,a=-1*o.mdx*t/l.canvas.width*e/this.projDist,h=-1*o.mdy*s/l.canvas.height*e/this.projDist;r=this.at.sub(this.loc).norm(),n=r.cross(this.up).norm(),r=r.cross(n);i=n.mulNum(a).add(r.mulNum(h)),this.at=this.at.add(i),this.loc=this.loc.add(i)}n=new d(0,e,0),r=new m;this.set(n.pointTransfrom(r.matrRotateX(s).mulMatr(r.matrRotateY(t)).mulMatr(r.matrTranslate(this.at))),this.at,this.up)}}(new d(1.5,5,14),new d(1.5,0,0),new d(0,1,0)),f=new m,v=l.createBuffer();class p{constructor(t,s){this.P=new d(t),this.N=null==s?new d(0):new d(s)}}class y{constructor(t,s){this.V=t,this.I=s,this.VBuf=l.createBuffer(),this.IBuf=l.createBuffer(),this.VA=l.createVertexArray(),this.NumOfElem=0,this.matrTrans=new m}createNorms(){for(let t=0;t<this.V.length;t++)this.V[t].N.set(0);for(let t=0;t<this.I.length;t+=3){var s=new d(this.V[this.I[t]].P),a=new d(this.V[this.I[t+1]].P),h=new d(this.V[this.I[t+2]].P),a=a.sub(s).cross(h.sub(s)).norm();this.V[this.I[t]].N=this.V[this.I[t]].N.add(a),this.V[this.I[t+1]].N=this.V[this.I[t+1]].N.add(a),this.V[this.I[t+2]].N=this.V[this.I[t+2]].N.add(a)}for(let t=0;t<this.V.length;t++)this.V[t].N.norm()}createBuffers(){var t,s=[];for(t of this.V)s.push(t.P.x),s.push(t.P.y),s.push(t.P.z),s.push(t.N.x),s.push(t.N.y),s.push(t.N.z);l.bindBuffer(l.ARRAY_BUFFER,this.VBuf),l.bufferData(l.ARRAY_BUFFER,4*s.length,l.STATIC_DRAW),l.bufferSubData(l.ARRAY_BUFFER,0,new Float32Array(s),0),l.bindVertexArray(this.VA);var a=l.getAttribLocation(n,"in_pos"),h=(l.vertexAttribPointer(a,3,l.FLOAT,!1,24,0),l.getAttribLocation(n,"in_norm"));return l.vertexAttribPointer(h,3,l.FLOAT,!1,24,12),l.enableVertexAttribArray(a),l.enableVertexAttribArray(h),l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,this.IBuf),l.bufferData(l.ELEMENT_ARRAY_BUFFER,4*this.I.length,l.STATIC_DRAW),l.bufferSubData(l.ELEMENT_ARRAY_BUFFER,0,new Uint32Array(this.I),0),this.NumOfElem=this.I.length,this}draw(){var t=this.matrTrans.mulMatr(f),s=this.matrTrans.mulMatr(f).mulMatr(M.matrVP),s=(l.useProgram(n),l.bindBuffer(l.UNIFORM_BUFFER,v),l.bufferData(l.UNIFORM_BUFFER,144,l.STATIC_DRAW),l.bufferSubData(l.UNIFORM_BUFFER,0,new Float32Array(s.toArray()),0),l.bufferSubData(l.UNIFORM_BUFFER,64,new Float32Array(t.toArray()),0),l.bufferSubData(l.UNIFORM_BUFFER,128,new Float32Array([M.loc.x,M.loc.y,M.loc.z,1]),0),l.getUniformBlockIndex(n,"UBuf"));l.uniformBlockBinding(n,s,0),l.bindBufferBase(l.UNIFORM_BUFFER,0,v),l.bindVertexArray(this.VA),l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,this.IBuf),l.drawElements(l.TRIANGLES,this.NumOfElem,l.UNSIGNED_INT,this.IBuf)}}function P(s,a,h,i){for(let t=0;t<a.length;t++)i.push(t),h.push(new p(new d(s[a[t]].P.x,s[a[t]].P.y,s[a[t]].P.z)))}class g{constructor(t,s,a){var h=[],i=[];P([new p(new d(0,-(t*Math.sqrt(6))/9,-t/3*Math.sqrt(3))),new p(new d(-.5*t,-(t*Math.sqrt(6))/9,t/6*Math.sqrt(3))),new p(new d(.5*t,-(t*Math.sqrt(6))/9,t/6*Math.sqrt(3))),new p(new d(0,t/3*Math.sqrt(6)-t*Math.sqrt(6)/9,0))],[0,1,2,0,1,3,0,2,3,1,2,3],h,i),this.Pr=new y(h,i),this.Pr.createNorms(),this.Pr.createBuffers(),this.pos=null!=s?s:new d(0),this.doesRotate=null==a||a,this.angle=0,this.Pr.matrTrans=this.Pr.matrTrans.matrTranslate(this.pos)}draw(){this.Pr.draw()}response(){var t;1==this.doesRotate&&(this.angle+=180*a.localDelta,t=new m,this.Pr.matrTrans=t.matrRotateY(this.angle).rotX(this.angle).mulMatr(t.matrTranslate(this.pos)))}}class x{constructor(t,s,a){var h=[],i=[];P([new p(new d(-t/2,0,-t/2)),new p(new d(-t/2,0,t/2)),new p(new d(t/2,0,t/2)),new p(new d(t/2,0,-t/2)),new p(new d(0,t/Math.sqrt(2),0)),new p(new d(0,-t/Math.sqrt(2),0))],[0,1,4,1,2,4,2,3,4,0,3,4,0,1,5,1,2,5,2,3,5,0,3,5],h,i),this.Pr=new y(h,i),this.Pr.createNorms(),this.Pr.createBuffers(),this.pos=null!=s?s:new d(0),this.doesRotate=null==a||a,this.angle=0,this.Pr.matrTrans=this.Pr.matrTrans.matrTranslate(this.pos)}draw(){this.Pr.draw()}response(){var t;1==this.doesRotate&&(this.angle+=180*a.localDelta,t=new m,this.Pr.matrTrans=t.matrRotateY(this.angle).rotX(this.angle).mulMatr(t.matrTranslate(this.pos)))}}class R{constructor(t,s,a){var h=[],i=[];P([new p(new d(-t/2,-t/2,-t/2)),new p(new d(-t/2,t/2,-t/2)),new p(new d(t/2,t/2,-t/2)),new p(new d(t/2,-t/2,-t/2)),new p(new d(-t/2,-t/2,t/2)),new p(new d(-t/2,t/2,t/2)),new p(new d(t/2,t/2,t/2)),new p(new d(t/2,-t/2,t/2))],[0,1,2,0,3,2,0,1,5,0,4,5,4,5,6,4,7,6,3,2,6,3,7,6,0,4,7,0,3,7,1,2,6,1,5,6],h,i),this.Pr=new y(h,i),this.Pr.createNorms(),this.Pr.createBuffers(),this.pos=null!=s?s:new d(0),this.doesRotate=null==a||a,this.angle=0,this.Pr.matrTrans=this.Pr.matrTrans.matrTranslate(this.pos)}draw(){this.Pr.draw()}response(){var t;1==this.doesRotate&&(this.angle+=180*a.localDelta,t=new m,this.Pr.matrTrans=t.matrRotateY(this.angle).rotX(this.angle).mulMatr(t.matrTranslate(this.pos)))}}class z{constructor(t,s,a){var h=t/4*(1+Math.sqrt(5))*Math.sqrt(3),t=t*Math.sqrt(5+Math.sqrt(5))/Math.sqrt(10),i=t*(Math.sqrt(5)+1)/2,e=Math.sqrt(h*h-t*t),h=Math.sqrt(h*h-i*i),n=[],r=[];P([new p(new d(t*Math.cos(w(0)),e,t*Math.sin(w(0)))),new p(new d(t*Math.cos(w(72)),e,t*Math.sin(w(72)))),new p(new d(t*Math.cos(w(144)),e,t*Math.sin(w(144)))),new p(new d(t*Math.cos(w(216)),e,t*Math.sin(w(216)))),new p(new d(t*Math.cos(w(288)),e,t*Math.sin(w(288)))),new p(new d(t*Math.cos(w(36)),-e,t*Math.sin(w(36)))),new p(new d(t*Math.cos(w(108)),-e,t*Math.sin(w(108)))),new p(new d(t*Math.cos(w(180)),-e,t*Math.sin(w(180)))),new p(new d(t*Math.cos(w(252)),-e,t*Math.sin(w(252)))),new p(new d(t*Math.cos(w(324)),-e,t*Math.sin(w(324)))),new p(new d(i*Math.cos(w(0)),h,i*Math.sin(w(0)))),new p(new d(i*Math.cos(w(72)),h,i*Math.sin(w(72)))),new p(new d(i*Math.cos(w(144)),h,i*Math.sin(w(144)))),new p(new d(i*Math.cos(w(216)),h,i*Math.sin(w(216)))),new p(new d(i*Math.cos(w(288)),h,i*Math.sin(w(288)))),new p(new d(i*Math.cos(w(36)),-h,i*Math.sin(w(36)))),new p(new d(i*Math.cos(w(108)),-h,i*Math.sin(w(108)))),new p(new d(i*Math.cos(w(180)),-h,i*Math.sin(w(180)))),new p(new d(i*Math.cos(w(252)),-h,i*Math.sin(w(252)))),new p(new d(i*Math.cos(w(324)),-h,i*Math.sin(w(324))))],[0,1,2,0,2,3,0,3,4,5,6,7,5,7,8,5,8,9,0,1,11,0,11,15,0,15,10,1,2,12,1,12,16,1,16,11,2,3,13,2,13,17,2,17,12,3,4,14,3,14,18,3,18,13,4,0,10,4,10,19,4,19,14,5,6,16,5,16,11,5,11,15,6,7,17,6,17,12,6,12,16,7,8,18,7,18,13,7,13,17,8,9,19,8,19,14,8,14,18,9,5,15,9,15,10,9,10,19],n,r),this.Pr=new y(n,r),this.Pr.createNorms(),this.Pr.createBuffers(),this.pos=null!=s?s:new d(0),this.doesRotate=null==a||a,this.angle=0,this.Pr.matrTrans=this.Pr.matrTrans.matrTranslate(this.pos)}draw(){this.Pr.draw()}response(){var t;1==this.doesRotate&&(this.angle+=180*a.localDelta,t=new m,this.Pr.matrTrans=t.matrRotateY(this.angle).rotX(this.angle).mulMatr(t.matrTranslate(this.pos)))}}class b{constructor(t,s,a){var h=t*Math.sqrt(5+Math.sqrt(5))/Math.sqrt(10),i=Math.sqrt(.75*t*t-h*h*(1-Math.cos(w(36)))*(1-Math.cos(w(36))))/2,t=Math.sqrt(t*t-h*h),e=[],n=[];P([new p(new d(0,i+t,0)),new p(new d(0,-i-t,0)),new p(new d(h*Math.cos(w(0)),i,h*Math.sin(w(0)))),new p(new d(h*Math.cos(w(72)),i,h*Math.sin(w(72)))),new p(new d(h*Math.cos(w(144)),i,h*Math.sin(w(144)))),new p(new d(h*Math.cos(w(216)),i,h*Math.sin(w(216)))),new p(new d(h*Math.cos(w(288)),i,h*Math.sin(w(288)))),new p(new d(h*Math.cos(w(36)),-i,h*Math.sin(w(36)))),new p(new d(h*Math.cos(w(108)),-i,h*Math.sin(w(108)))),new p(new d(h*Math.cos(w(180)),-i,h*Math.sin(w(180)))),new p(new d(h*Math.cos(w(252)),-i,h*Math.sin(w(252)))),new p(new d(h*Math.cos(w(324)),-i,h*Math.sin(w(324))))],[2,3,0,3,4,0,4,5,0,5,6,0,6,2,0,2,3,7,7,8,3,3,4,8,8,9,4,4,5,9,9,10,5,5,6,10,10,11,6,6,2,11,11,7,2,7,8,1,8,9,1,9,10,1,10,11,1,11,7,1],e,n),this.Pr=new y(e,n),this.Pr.createNorms(),this.Pr.createBuffers(),this.pos=null!=s?s:new d(0),this.doesRotate=null==a||a,this.angle=0,this.Pr.matrTrans=this.Pr.matrTrans.matrTranslate(this.pos)}draw(){this.Pr.draw()}response(){var t;1==this.doesRotate&&(this.angle+=180*a.localDelta,t=new m,this.Pr.matrTrans=t.matrRotateY(this.angle).rotX(this.angle).mulMatr(t.matrTranslate(this.pos)))}}let T=[];async function F(){return new Promise((t,s)=>{new Promise((t,s)=>{var a=r(l.VERTEX_SHADER,i),h=r(l.FRAGMENT_SHADER,e);n=l.createProgram(),l.attachShader(n,a),l.attachShader(n,h),l.linkProgram(n),l.getProgramParameter(n,l.LINK_STATUS)||s(l.getProgramInfoLog(n)),t()}).then(()=>{T.push(new g(1,new d(-3,0,1.5))),T.push(new x(1,new d(0,0,1.5))),T.push(new R(1,new d(3,0,1.5))),T.push(new z(1,new d(6,0,1.5))),T.push(new b(1,new d(9,0,1.5))),T.push(new g(1,new d(-3,0,-1.5),!1)),T.push(new x(1,new d(0,0,-1.5),!1)),T.push(new R(1,new d(3,0,-1.5),!1)),T.push(new z(1,new d(6,0,-1.5),!1)),T.push(new b(1,new d(9,0,-1.5),!1)),t()}).catch(t=>{s(t)})})}function E(){l.clearColor(.2,.47,.3,1),l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT),l.enable(l.DEPTH_TEST),o.update(),a.response(),M.move();for(var t of T)null!=t.response&&t.response();for(var s of T)null!=s.draw&&s.draw();window.requestAnimationFrame(E)}t=document.getElementById("glCanvas");window.addEventListener("mouseup",t=>{o.handleEvent(t)}),t.addEventListener("mousedown",t=>{o.handleEvent(t)}),window.addEventListener("mousemove",t=>{o.handleEvent(t)}),t.addEventListener("wheel",t=>{o.handleEvent(t)}),window.addEventListener("load",function(){F().then(()=>{E()}).catch(t=>{console.log(t)})})}();
