import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as n}from"./index.DtoOFyvK.js";import{c as o}from"./createLucideIcon.BY18stqz.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],c=o("facebook",a);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],i=o("linkedin",l);/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],d=o("twitter",h),u=({title:t})=>{const[r,s]=n.useState("");return n.useEffect(()=>{s(window.location.href)},[]),r?e.jsxs("div",{className:"mt-4 flex gap-2",children:[e.jsx("a",{href:`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(r)}`,className:"inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted",target:"_blank",rel:"noopener noreferrer",children:e.jsx(d,{className:"h-4 w-4"})}),e.jsx("a",{href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(r)}`,className:"inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted",target:"_blank",rel:"noopener noreferrer",children:e.jsx(c,{className:"h-4 w-4"})}),e.jsx("a",{href:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(r)}`,className:"inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted",target:"_blank",rel:"noopener noreferrer",children:e.jsx(i,{className:"h-4 w-4"})})]}):null};export{u as ShareButtons};
