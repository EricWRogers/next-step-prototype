export function bar_init()
{
    document.querySelectorAll('.nav-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // notify main script
        window.dispatchEvent(new CustomEvent('nav-change', { detail: { index } }));
      });
    });
}
