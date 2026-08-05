/* Central API URL. Vite proxies /api to Django during local development. */
const BASE=import.meta.env.VITE_API_URL||'/api';
/* Saves the authenticated token and user role between page refreshes. */
export const session={get:()=>JSON.parse(localStorage.getItem('zanhotel_session')||'null'),set:v=>localStorage.setItem('zanhotel_session',JSON.stringify(v)),clear:()=>localStorage.removeItem('zanhotel_session')};
/* Adds authentication/JSON headers, parses responses, and normalizes API errors. */
export async function api(path,options={}){const s=session.get();const headers={...(s?.token?{Authorization:`Token ${s.token}`}:{})};if(!(options.body instanceof FormData))headers['Content-Type']='application/json';const res=await fetch(`${BASE}${path}`,{...options,headers:{...headers,...options.headers}});let data={};try{data=await res.json()}catch{}if(!res.ok)throw new Error(data.detail||Object.values(data.errors||{}).flat().join(' ')||'Request failed');return data}
export const money=n=>new Intl.NumberFormat('en-TZ').format(n||0);
