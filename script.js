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

  // Student form - shows popup first, then submits after confirmation
  const studentForm = document.getElementById("studentForm")
  const btnPagamento = document.getElementById("btnPagamento")
  const popup = document.getElementById("popup")
  const confirmBtn = document.getElementById("confirmBtn")
  const cancelBtn = document.getElementById("cancelBtn")
  const cancelBtn2 = document.getElementById("cancelBtn2")

  // Student form button click - show popup
  if (btnPagamento) {
    btnPagamento.addEventListener("click", (e) => {
      e.preventDefault()

      if (!validateForm(studentForm)) {
        showAlert("Por favor, preencha todos os campos obrigatórios.", "error")
        return
      }

      if (popup) {
        popup.style.display = "block"
        document.body.style.overflow = "hidden"
      }
    })
  }

  // Popup confirm button - submit student form
  if (confirmBtn && studentForm) {
    confirmBtn.addEventListener("click", async (e) => {
      e.preventDefault()

      if (popup) {
        popup.style.display = "none"
        document.body.style.overflow = "auto"
      }

      const submitBtn = confirmBtn
      showLoadingState(submitBtn, true)

      try {
        const formData = new FormData(studentForm)

        const response = await fetch(studentForm.action, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          showAlert("✅ Inscrição enviada com sucesso! Você receberá uma confirmação por email.", "success")
          clearForm(studentForm)
        } else {
          throw new Error("Erro na resposta do servidor")
        }
      } catch (error) {
        console.error("Erro no envio:", error)
        showAlert("❌ Erro na conexão. Verifique sua internet ou tente mais tarde.", "error")
      } finally {
        showLoadingState(submitBtn, false)
      }
    })
  }

  // Popup cancel buttons
  if (cancelBtn && popup) {
    cancelBtn.addEventListener("click", () => {
      popup.style.display = "none"
      document.body.style.overflow = "auto"
    })
  }

  if (cancelBtn2 && popup) {
    cancelBtn2.addEventListener("click", () => {
      popup.style.display = "none"
      document.body.style.overflow = "auto"
    })
  }

  // Close popup when clicking outside
  if (popup) {
    window.addEventListener("click", (event) => {
      if (event.target === popup) {
        popup.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  }

  // Visitor form - direct submission
  const visitorForm = document.getElementById("visitorForm")
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

        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          showAlert("✅ Inscrição enviada com sucesso! Você receberá uma confirmação por email.", "success")
          clearForm(this)
        } else {
          throw new Error("Erro na resposta do servidor")
        }
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


const colegiosPorCidade = {
  "Ivaipora": [
    { value: "Antonio Diniz", text: "C. E. Antônio Diniz Pereira" },
    { value: "Barbosa Ferraz", text: "C. E. Barbosa Ferraz" },
    { value: "Bento Mossurunga", text: "C. E. Bento Mossurunga" },
    { value: "Ceebja", text: "Ceebja de Ivaiporã - E. F. M." },
    { value: "Barão do Cerro Azul", text: "C. E. Barão do Cerro Azul" },
    { value: "Idalia Rocha", text: "C. E. Idalia Rocha" },
    { value: "Jose de Mattos", text: "E. E. C. José de Mattos Leão" },
    { value: "Nilo Pecanha", text: "C. E. Nilo Peçanha" },
    { value: "Santa Barbara", text: "E. E. C. Santa Bárbara" }
  ],
  "Jardim Alegre": [
    { value: "Anita Garibaldi", text: "C. E. Anita Garibaldi" },
    { value: "Barra Preta", text: "C. E. Barra Preta" },
    { value: "Cora Coralina", text: "C. E. Cora Coralina" },
    { value: "Cristovao Colombo", text: "C. E. Cristóvão Colombo" },
    { value: "Jose Marti", text: "C. E. José Martí" },
  ],
  "Lidianopolis": [
    { value: "Pedro I", text: "C. E. Pedro I" },
    { value: "Benedito Serra", text: "E. E. C. Benedito Serra" }
  ],
  "Lunardelli": [
    { value: "Geremia Lunardelli", text: "C. E. Geremia Lunardelli" },
    { value: "Leonardo Becher", text: "E. E. C. Leonardo Becher" }
  ],
  "Arapua": [
    { value: "Arapua", text: "C. E. Arapuã" },
    { value: "Candida", text: "C. E. Cândida" },
    { value: "Romeopolis", text: "C. E. Romeópolis" }
  ],
    "Cruzmaltina": [
      { value: "Gualter Farias Negrao", text: "C.E. Gualter Farias Negrao" },
      { value: "Jose Ferreira Diniz", text: "C.E. Jose Ferreira Diniz" },
    ],
  "Ariranha": [
      { value: "Kennedy", text: "C.E. Kennedy" }
    ],
   "Sao Joao do Ivai": [
      { value: "Arthur de Azevedo", text: "C.E. Arthur de Azevedo" },
      { value: "Diogo A Correia", text: "C.E. Diogo A Correia" },
     { value: "Jamil Aparecido Bonacin", text: "C.E. Jamil Aparecido Bonacin" },
     { value: "Jose de Mattos Leao", text: "C.E. Jose de Mattos Leao" },
     { value: "	Julio Emerenciano", text: "C.E. 	Julio Emerenciano" },
    ],
  "Sao Pedro do Ivai": [
      { value: "Carlos Silva", text: "C.E. Carlos Silva" },
      { value: "Conj Hab Virginio Seco", text: "C.E. Conj Hab Virginio Seco" },
     { value: "Mariza", text: "C.E. Mariza" },
     { value: "Vicente Machado", text: "C.E. Vicente Machado" }
    ],
  // Adicione as outras cidades e seus colégios aqui
};

const cidadeSelect = document.getElementById("cidade");
const colegioSelect = document.getElementById("colegio");

cidadeSelect.addEventListener("change", function () {
  const cidadeSelecionada = this.value;

  // Limpa o select de colégio
  colegioSelect.innerHTML = "";

  if (colegiosPorCidade[cidadeSelecionada]) {
      // Adiciona uma opção default
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Selecione o colégio";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      colegioSelect.appendChild(defaultOption);

      // Popula os colégios da cidade selecionada
      colegiosPorCidade[cidadeSelecionada].forEach(colegio => {
          const option = document.createElement("option");
          option.value = colegio.value;
          option.textContent = colegio.text;
          colegioSelect.appendChild(option);
      });
  } else {
      // Se não houver colégios para a cidade, mostra uma mensagem
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Nenhum colégio disponível";
      option.disabled = true;
      option.selected = true;
      colegioSelect.appendChild(option);
  }

});
