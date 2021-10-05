export default function themeSwitch() {
    // Toggle Dark Theme
    let d = document.documentElement;
    let btn = document.querySelectorAll('#theme-btn');
    let m = localStorage.getItem('theme');

    if (m == 'dark') {
        d.classList.add('theme-dark');
    } 
    // else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    //     d.classList.add('theme-dark');
    // }

    btn.forEach(el => { 
      el.addEventListener('click', function () {
        if (d.classList.contains('theme-dark')) {
            d.classList.remove('theme-dark');
            localStorage.removeItem('theme');
        } else {
            d.classList.add('theme-dark');
            localStorage.setItem('theme', 'dark');
        }
      });
    })
}