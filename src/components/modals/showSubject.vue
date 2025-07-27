<template>
    <div
      class="modal fade"
      id="showSubject"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <i class="fas fa-clipboard-list"></i> موضوع کامل جلسه
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="subject-container">
              <i class="fas fa-info-circle"></i>
              <p class="subject-text">{{ localSubject }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import "vue3-toastify/dist/index.css";
  import { watch, ref } from "vue";
  
  export default {
    props: {
      subject: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const localSubject = ref();
  
      watch(
        () => props.subject,
        (newVal) => (localSubject.value = newVal)
      );
      return {
        localSubject,
      };
    },
  };
  </script>
  
  <style scoped>
  .modal-dialog {
    max-width: 400px;
  }
  
  .modal-content {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom right, #f7f9fc, #e1e8ed); /* Gradient background */
  }
  
  .modal-header {
    border-bottom: none; /* Remove default border */
  }
  
  .modal-title {
    color: #007bff;
    font-weight: bold;
    font-size: 1.5rem;
    display: flex;
    align-items: center; /* Center the icon and text vertically */
  }
  
  .modal-title i {
    margin-right: 8px; /* Space between icon and title */
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .subject-container {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .subject-container i {
    color: #007bff; /* Icon color */
    margin-right: 10px;
    font-size: 1.5rem;
  }
  
  .subject-text {
    color: #333;
    font-weight: 500;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background 0.3s;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  </style>
  