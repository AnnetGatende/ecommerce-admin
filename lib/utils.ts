export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
export const formatter=new Intl.NumberFormat("en-US",{
  style:'currency',
  currency:'USD'
});
