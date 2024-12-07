document.addEventListener('DOMContentLoaded', () => {
    const modals = new Map();
    const backdrop = document.querySelector('.backdrop');
    const modalSize = document.getElementById('modal-size');
    const modalCoords = document.getElementById('modal-coords');
  
    // сохранить в Map все модальные окна вместе с начальными размерами и координатами
    document.querySelectorAll('.modal').forEach((modal) => {
      modals.set(modal.id, {
        element: modal,
        size: { width: 300, height: 300 },
        coords: { x: 100, y: 100 },
      });
    });
  
    // обработчик события для кнопок открывающих окна
    document.querySelectorAll('.open-modal').forEach((button) => {
      button.addEventListener('click', (e) => {
        const modalId = `modal${e.target.dataset.modal}`;
        const modalData = modals.get(modalId);
        showModal(modalData);
      });
    });
  
    document.querySelectorAll('.modal .close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeModal);
    });
  
    // кнопка установить новые параметры окна
    document.getElementById('apply-settings').addEventListener('click', () => {
      const [width, height] = modalSize.value.split('x').map(Number);
      const [x, y] = modalCoords.value.split('x').map(Number);
  
      modals.forEach((modalData) => {
        const updateModal = updateModalSettings.bind(modalData, width, height, x, y);
        updateModal();
      });
    });
  
    function showModal(modalData) {
      const { element, size, coords } = modalData;
      element.style.display = 'block';
      element.style.width = `${size.width}px`;
      element.style.height = `${size.height}px`;
      element.style.left = `${coords.x}px`;
      element.style.top = `${coords.y}px`;
      backdrop.style.display = 'block';
    }
  
    function closeModal() {
      document.querySelectorAll('.modal').forEach((modal) => (modal.style.display = 'none'));
      backdrop.style.display = 'none';
    }
  
    function updateModalSettings(width, height, x, y) {
      this.size.width = width;
      this.size.height = height;
      this.coords.x = x;
      this.coords.y = y;
    }
  });
  