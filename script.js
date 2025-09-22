// Form type switching
document.addEventListener("DOMContentLoaded", () => {
  const typeCards = document.querySelectorAll(".type-card")
  const alunoForm = document.getElementById("alunoForm")
  const visitanteForm = document.getElementById("visitanteForm")

  // Initialize with student form
  showForm("aluno")

  const radioButtons = document.querySelectorAll('input[name="tipo_usuario"]')
  const studentOnlyFields = document.querySelectorAll(".student-only-field")
  const teacherOnlyFields = document.querySelectorAll(".teacher-only-field")

  // Handle radio button changes
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "professor") {
        // Hide student-only fields and remove required attribute
        studentOnlyFields.forEach((field) => {
          field.classList.add("hidden")
          const inputs = field.querySelectorAll("input, select")
          inputs.forEach((input) => {
            input.removeAttribute("required")
          })
        })

        // Show teacher-only fields and add required attribute
        teacherOnlyFields.forEach((field) => {
          field.classList.add("show")
          field.style.display = "flex"
          const inputs = field.querySelectorAll("input, select")
          inputs.forEach((input) => {
            input.setAttribute("required", "required")
          })
        })
      } else {
        // Show student-only fields and add required attribute
        studentOnlyFields.forEach((field) => {
          field.classList.remove("hidden")
          const inputs = field.querySelectorAll("input, select")
          inputs.forEach((input) => {
            input.setAttribute("required", "required")
          })
        })

        // Hide teacher-only fields and remove required attribute
        teacherOnlyFields.forEach((field) => {
          field.classList.remove("show")
          field.style.display = "none"
          const inputs = field.querySelectorAll("input, select")
          inputs.forEach((input) => {
            input.removeAttribute("required")
          })
        })
      }
    })
  })

  typeCards.forEach((card) => {
    card.addEventListener("click", function () {
      const type = this.dataset.type

      // Update active state
      typeCards.forEach((c) => c.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding form
      showForm(type)
    })
  })

  function showForm(type) {
    if (type === "aluno") {
      alunoForm.classList.remove("hidden")
      visitanteForm.classList.add("hidden")
    } else {
      alunoForm.classList.add("hidden")
      visitanteForm.classList.remove("hidden")
    }
  }

  // Enhanced form submission handlers
  const studentForm = document.getElementById("studentForm")
  const visitorForm = document.getElementById("visitorForm")

  if (studentForm) {
    studentForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      if (!validateForm(this)) {
        showAlert("Por favor, preencha todos os campos obrigatórios.", "error")
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      showLoadingState(submitBtn, true)

      try {
        const formData = new FormData(this)

        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In real implementation, use:
        // const response = await fetch(this.action, {
        //   method: "POST",
        //   body: formData,
        // })
        // const result = await response.json()

        showAlert("✅ Inscrição enviada com sucesso! Você receberá uma confirmação por email.", "success")
        clearForm(this)
      } catch (error) {
        console.error("Erro no envio:", error)
        showAlert("❌ Erro na conexão. Verifique sua internet ou tente mais tarde.", "error")
      } finally {
        showLoadingState(submitBtn, false)
      }
    })
  }

  if (visitorForm) {
    visitorForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      if (!validateForm(this)) {
        showAlert("Por favor, preencha todos os campos obrigatórios.", "error")
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      showLoadingState(submitBtn, true)

      try {
        const formData = new FormData(this)

        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In real implementation, use:
        // const response = await fetch(this.action, {
        //   method: "POST",
        //   body: formData,
        // })
        // const result = await response.json()

        showAlert("✅ Inscrição enviada com sucesso! Você receberá uma confirmação por email.", "success")
        clearForm(this)
      } catch (error) {
        console.error("Erro no envio:", error)
        showAlert("❌ Erro na conexão. Verifique sua internet ou tente mais tarde.", "error")
      } finally {
        showLoadingState(submitBtn, false)
      }
    })
  }
})

function closePopup() {
  const popup = document.getElementById("popup")
  if (popup) {
    popup.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// CPF Mask
function mascara(i) {
  var v = i.value

  if (isNaN(v[v.length - 1])) {
    i.value = v.substring(0, v.length - 1)
    return
  }

  i.setAttribute("maxlength", "14")
  if (v.length == 3 || v.length == 7) i.value += "."
  if (v.length == 11) i.value += "-"
}

// RG Mask
function mascaraRG(input) {
  input.value = input.value.replace(/[A-Za-z]/g, "")
}

// Phone Mask
const handlePhone = (event) => {
  const input = event.target
  input.value = phoneMask(input.value)
}

const phoneMask = (value) => {
  if (!value) return ""
  value = value.replace(/\D/g, "")
  value = value.replace(/(\d{2})(\d)/, "($1) $2")
  value = value.replace(/(\d)(\d{4})$/, "$1-$2")
  return value
}

// Utility functions for loading states, alerts and form clearing
function showLoadingState(button, isLoading) {
  if (!button) return

  if (isLoading) {
    button.disabled = true
    button.classList.add("loading")

    // Store original content
    button.dataset.originalContent = button.innerHTML

    // Add spinner with better styling
    button.innerHTML = `
      <div class="spinner"></div>
      Enviando...
    `
  } else {
    button.disabled = false
    button.classList.remove("loading")

    // Restore original content
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent
    }
  }
}

function showAlert(message, type = "info") {
  // Remove existing alerts
  const existingAlert = document.querySelector(".custom-alert")
  if (existingAlert) {
    existingAlert.remove()
  }

  // Create alert element
  const alert = document.createElement("div")
  alert.className = `custom-alert custom-alert-${type}`

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"

  alert.innerHTML = `
    <div class="alert-content">
      <span class="alert-icon">${icon}</span>
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `

  // Add to page
  document.body.appendChild(alert)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 5000)

  // Animate in
  setTimeout(() => {
    alert.classList.add("show")
  }, 100)
}

function clearForm(form) {
  // Reset all form fields
  form.reset()

  // Clear any validation styles
  const inputs = form.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.style.borderColor = ""
    input.classList.remove("error")
  })

  // Reset radio buttons to default state (only for student form)
  if (form.id === "studentForm") {
    const tipoUsuarioRadios = form.querySelectorAll('input[name="tipo_usuario"]')
    if (tipoUsuarioRadios.length > 0) {
      tipoUsuarioRadios[0].checked = true // Select first option (aluno)
      tipoUsuarioRadios[0].dispatchEvent(new Event("change"))
    }
  }
}

// Form validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444"
      isValid = false
    } else {
      field.style.borderColor = "rgba(75, 85, 99, 0.5)"
    }
  })

  return isValid
}

// Smooth animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe form elements for animations
document.querySelectorAll(".form-group").forEach((el) => {
  observer.observe(el)
})

// Add focus effects to inputs
document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)"
  })

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)"
  })
})

console.log("🚀 SETEC 2025 - Formulário carregado com sucesso!")
