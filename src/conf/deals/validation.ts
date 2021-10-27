interface Iobject {
    [key: string]: any
}

const division = (n: any, d: any) => {
  try {
    const r = n / d
    return Math.round(r) === Math.round(r * 10) / 10
  } catch (err) {
    return false
  }
}

export function validItem(d: Iobject, s: Iobject, key: string, allInvalid: boolean): boolean {
  if (s[key] === undefined) return false
  if (d[key] === null) return allInvalid

  if (s[key].list !== null) {
    if (d[key].length === 0) return true
  }

  if (s[key].list === null && s[key].type === 'text') {
    const length = d[key].length >= s[key]['min-length'] && d[key].length <= s[key]['max-length']
    if (s[key].simbols === 'all' && !length) return true
  }

  if (s[key].list === null && s[key].type === 'tel') {
    if (!Number(d[key])) return true
    const isIn = d[key] >= s[key]['min-value'] && d[key] <= s[key]['max-value']
    if (!isIn) return true
    if (!division(d[key], s[key].division)) return true
  }

  return false
}

// export function validationItem(d: Iobject, s: Iobject, key: string): void {
//   if (s[key] === undefined) return
//   s[key].novalid = false
    
//     if (s[key].list !== null) {
//       if (d[key].length === 0) s[key].novalid = true
//     }
    
//     if (s[key].list === null && s[key].type === 'text') {
//       const length = d[key].length >= s[key]['min-length'] && d[key].length <= s[key]['max-length']
//       if (s[key].simbols === 'all' && !length) s[key].novalid = true
//     }
    
//   if (s[key].list === null && s[key].type === 'tel') {
//     if (!Number(d[key])) d[key] = d[key].replace(',', '.')
//     if (!Number(d[key])) {
//       s[key].novalid = true
//       return
//     } 
//     d[key] = Number(d[key])
//     const isIn = d[key] >= s[key]['min-value'] && d[key] <= s[key]['max-value']
//     if (!isIn) s[key].novalid = true
//     if (!division(d[key], s[key].division)) s[key].novalid = true
//   }
// }

// export function getValidation(
//   deal: Iobject, 
//   scheme: Iobject, 
//   item: string | null = null,
//   validTimer = 0,
// ): Promise<void> {
//   if (vTimeout) clearTimeout(vTimeout)
//   return new Promise<void>((resolve) => {
//     vTimeout = setTimeout(() => {
//       Object.keys(deal).forEach((key: string) => {
//         if (Array.isArray(deal[key])) {
//           deal[key].forEach((a: Iobject) => {
//             getValidation(a, scheme, item)
//           })
//           return
//         }
//         if (item !== null) {
//           if (key === item) validationItem(deal, scheme, key)
//           return
//         }
//         if (item === null) validationItem(deal, scheme, key)
//       })
//       console.log(deal)
//       resolve()
//     }, validTimer)
//   })
// }
