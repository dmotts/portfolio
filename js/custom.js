// script.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('#project-list .col-md-6');

    filterButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const filter = button.getAttribute('data-filter');

            // Remove 'active' class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Filter items
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filter === 'all' || itemCategory === filter) {
                    if (item.classList.contains('hidden')) {
                        item.classList.remove('hidden', 'fadeOut');
                        item.classList.add('fadeIn');
                    }
                } else {
                    if (!item.classList.contains('hidden')) {
                        item.classList.remove('fadeIn');
                        item.classList.add('fadeOut');
                        setTimeout(() => {
                            item.classList.add('hidden');
                        }, 500); // Match the duration of the fadeOut animation
                    }
                }
            });
        });
    });
});
