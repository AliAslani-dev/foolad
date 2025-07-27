<template>
    <div
      class="modal fade"
      id="showVisitor"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <i class="fas fa-user-circle"></i> اطلاعات طرف ملاقات
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="info-container">
              <div class="info-item">
                <i class="fas fa-user"></i>
                <div class="info-text">
                  <strong>نام:</strong> {{ localName }}
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                <div class="info-text">
                  <strong>موبایل:</strong> {{ localMobile }}
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-briefcase"></i>
                <div class="info-text">
                  <strong>نقش:</strong> {{ localRole }}
                </div>
              </div>
              <div class="info-item">
                <i class="fas fa-building"></i>
                <div class="info-text">
                  <strong>شرکت:</strong> {{ localCompany }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
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
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const localName = ref(props.name);
      const localMobile = ref(props.mobile);
      const localRole = ref(props.role);
      const localCompany = ref(props.company);
  
      watch(
        () => props.name,
        (newVal) => (localName.value = newVal)
      );
      watch(
        () => props.mobile,
        (newVal) => (localMobile.value = newVal)
      );
      watch(
        () => props.role,
        (newVal) => (localRole.value = newVal)
      );
      watch(
        () => props.company,
        (newVal) => (localCompany.value = newVal)
      );
  
      return {
        localName,
        localMobile,
        localRole,
        localCompany,
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
    background: #fefefe; /* Light background for contrast */
  }
  
  .modal-header {
    border-bottom: 1px solid #007bff; /* Styled header border */
    background-color: #e7f1ff; /* Light blue background */
    padding: 15px 20px; /* Padding for header */
  }
  
  .modal-title {
    color: #007bff;
    font-weight: bold;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
  }
  
  .modal-title i {
    margin-right: 8px;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 20px; /* Padding for the body */
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    padding: 10px 0; /* Padding around info items */
  }
  
  .info-item {
    display: flex;
    align-items: center;
    padding: 12px 0; /* Padding for each info item */
    border-bottom: 1px solid #f0f0f0; /* Divider between items */
  }
  
  .info-item:last-child {
    border-bottom: none; /* Remove border from last item */
  }
  
  .info-item i {
    color: #007bff; /* Icon color */
    margin-right: 15px; /* Increased space between icon and text */
    font-size: 1.5rem;
  }
  
  .info-text {
    color: #333;
    font-weight: 500;
    margin-left: 5px; /* Slight margin for a more balanced look */
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    padding: 10px 20px; /* Padding for footer */
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
    padding: 10px 15px; /* Increased padding for button */
    border-radius: 8px;
    transition: background 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
  </style>
  