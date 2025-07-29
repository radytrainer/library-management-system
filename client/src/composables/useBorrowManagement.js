import { ref, computed, provide } from "vue";
import {
  getBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
} from "@/services/Api/borrow";
import { getBooks, updateBook } from "@/services/Api/book";

export function useBorrowManagement() {
  const borrowData = ref([]);
  const booksData = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");
  const limit = ref(10);
  const currentPage = ref(1);
  const selectedStatus = ref("");
  const selectedCategory = ref("");
  const showModal = ref(false);
  const showBookDetail = ref(false);
  const showUpdateModal = ref(false);
  const showConfirmModal = ref(false);
  const openDropdown = ref(null);
  const selectedBook = ref({});
  const returnId = ref(null);
  const message = ref("");
  const messageType = ref("success");
  const formError = ref("");

  const addForm = ref({
    borrowerType: "new",
    user_name: "",
    email_borrower: "",
    user_id: "",
    books: [{ isbn: "", book_name: "", date_return: "" }],
    librarian_name: "",
    date_borrow: "",
    status: "borrowed",
  });

  const updateForm = ref({
    id: null,
    user_name: "",
    email_borrower: "",
    book_name: "",
    return_date: "",
    status: "",
  });

  const statusOptions = ref([
    { value: "return", label: "Return" },
    { value: "returned", label: "Returned" },
  ]);

  // Provide the composable's context to child components
  provide("borrowManagement", {
    getBook,
    showToast,
    fetchBooksData,
    booksData,
  });

  // Categories computed property
  const categories = computed(() => {
    const set = new Set(borrowData.value.map((item) => item.book.category));
    return Array.from(set).map((name, index) => ({ id: index + 1, name }));
  });

  // Stats computed properties
  const borrowedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "borrowed").length;
  });
  const returnedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "returned").length;
  });
  const overdueCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "overdue").length;
  });

  // Filtering logic
  const filteredBorrowData = computed(() => {
    let filtered = borrowData.value;
    if (selectedCategory.value) {
      filtered = filtered.filter((item) => item.book.category === selectedCategory.value);
    }
    if (selectedStatus.value) {
      filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
    }
    if (search.value) {
      filtered = filtered.filter(
        (item) =>
          item.book.title.toLowerCase().includes(search.value.toLowerCase()) ||
          item.user.name.toLowerCase().includes(search.value.toLowerCase())
      );
    }
    const start = (currentPage.value - 1) * limit.value;
    return filtered.slice(start, start + limit.value);
  });

  const totalFilteredItems = computed(() => {
    let filtered = borrowData.value;
    if (selectedCategory.value) {
      filtered = filtered.filter((item) => item.book.category === selectedCategory.value);
    }
    if (selectedStatus.value) {
      filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
    }
    if (search.value) {
      filtered = filtered.filter(
        (item) =>
          item.book.title.toLowerCase().includes(search.value.toLowerCase()) ||
          item.user.name.toLowerCase().includes(search.value.toLowerCase())
      );
    }
    return filtered.length;
  });

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalFilteredItems.value / limit.value));
  });

  // Helper functions
  function getItemStatus(item) {
    if (item.status === "returned") return "returned";
    const today = new Date();
    const returnDate = new Date(item.return_date);
    if (today > returnDate) return "overdue";
    return "borrowed";
  }

  function getDaysLeft(item) {
    if (item.status === "returned") return 0;
    const today = new Date();
    const returnDate = new Date(item.return_date);
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  }

  function toggleDropdown(id) {
    openDropdown.value = openDropdown.value === id ? null : id;
  }

  function showToast(msg, type = "success") {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => {
      message.value = "";
      messageType.value = "";
    }, 3000);
  }

  // API functions
  async function fetchBooksData() {
    try {
      loading.value = true;
      const response = await getBooks();
      console.log("Raw API response for getBooks:", response); // Debug log
      booksData.value = Array.isArray(response.data.books) ? response.data.books : [];
      console.log("Books fetched:", booksData.value); // Debug log
      if (!booksData.value.length) {
        showToast("No books available in the database. Please add books to continue.", "error");
      }
    } catch (err) {
      console.error("Error fetching books:", err.message, err.stack); // Detailed debug log
      showToast("Failed to load book data. Please check your connection or database.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function getBook(identifier, type = "isbn") {
    try {
      if (!identifier) throw new Error(`${type.toUpperCase()} is missing or invalid`);
      console.log(`Looking for book with ${type}: ${identifier}`); // Debug log
      let book;
      if (type === "isbn") {
        const normalizedIsbn = identifier.trim();
        book = booksData.value.find((b) => b.isbn === normalizedIsbn);
      } else if (type === "id") {
        book = booksData.value.find((b) => b.id === identifier);
      } else if (type === "title") {
        book = booksData.value.find((b) => b.title.toLowerCase() === identifier.toLowerCase());
      }
      if (!book) {
        throw new Error(`Book not found for ${type}: ${identifier}`);
      }
      console.log("Book found:", book);
      return book;
    } catch (error) {
      console.error("Error in getBook:", error.message, error.stack); // Debug log
      return null;
    }
  }

  async function fetchBorrowData() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getBorrows();
      console.log("Raw API response for getBorrows:", response); // Debug log
      borrowData.value = response.data;
      console.log("Borrow data fetched:", borrowData.value); // Debug log
    } catch (err) {
      console.error("Error fetching borrow data:", err.message, err.stack); // Debug log
      error.value = "Failed to load borrow records.";
      showToast("Failed to load borrow records.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function submitAddBorrow(borrowData) {
    console.log("submitAddBorrow called with borrowData:", borrowData); // Debug log
    try {
      // Validate each book ISBN before submission
      for (const book of borrowData.books) {
        console.log("Validating book ISBN:", book.isbn); // Debug log
        if (!book.isbn || !/^(?:\d{10}|\d{13})$/.test(book.isbn)) {
          throw new Error(`Invalid ISBN: ${book.isbn}`);
        }
        const foundBook = await getBook(book.isbn, "isbn");
        if (!foundBook) {
          throw new Error(`Book not found for ISBN: ${book.isbn}`);
        }
      }
      // Proceed with API call using createBorrow
      const response = await createBorrow(borrowData);
      console.log("Response from createBorrow:", response); // Debug log
      addForm.value = { ...addForm.value, books: [{ isbn: "", book_name: "", date_return: "" }] }; // Reset form
      await fetchBorrowData(); // Refresh borrows list
      showToast("Borrow record added successfully!", "success");
      return response.data;
    } catch (error) {
      console.error("Error in submitAddBorrow:", error.message, error.stack); // Debug log
      showToast(`Failed to add borrow record: ${error.message}`, "error");
      throw error;
    }
  }

  async function submitUpdate(formData) {
    try {
      const payload = {
        user_name: formData.user_name,
        email_borrower: formData.email_borrower,
        book_name: formData.book_name,
        return_date: formData.return_date,
        status: formData.status,
      };
      console.log("Submitting update payload:", payload); // Debug log
      await updateBorrow(formData.id, payload);
      Object.assign(updateForm.value, formData);
      showUpdateModal.value = false;
      formError.value = "";
      showToast("Borrow record updated successfully.");
      await fetchBorrowData();
      await fetchBooksData();
    } catch (err) {
      console.error("Error in submitUpdate:", err.message, err.stack); // Debug log
      formError.value = "Failed to update borrow record.";
    }
  }

  async function handleDelete(id) {
    try {
      console.log("Deleting borrow record with ID:", id); // Debug log
      await deleteBorrow(id);
      await fetchBorrowData();
      await fetchBooksData();
      showToast("Borrow record deleted successfully.", "success");
    } catch (error) {
      console.error("Error in handleDelete:", error.message, error.stack); // Debug log
      showToast("Failed to delete record: " + error.message, "error");
    }
  }

  async function handleConfirmReturn() {
    try {
      if (!returnId.value) {
        throw new Error("No borrow record ID provided");
      }
      const borrowRecord = borrowData.value.find((item) => item.id === returnId.value);
      if (!borrowRecord) {
        throw new Error(`Borrow record with ID ${returnId.value} not found`);
      }
      console.log("Returning borrow record:", borrowRecord); // Debug log
      await updateBorrow(returnId.value, {
        status: "returned",
        return_date: new Date().toISOString().slice(0, 10),
      });
      const book =
        (await getBook(borrowRecord.book?.isbn || borrowRecord.isbn, "isbn")) ||
        (await getBook(borrowRecord.book?.id, "id")) ||
        (await getBook(borrowRecord.book?.title, "title"));
      if (book) {
        const updatedQuantity = book.quantity + (borrowRecord.borrowed_quantity || 1);
        await updateBook(book.id, { quantity: updatedQuantity });
      }
      await fetchBorrowData();
      await fetchBooksData();
      showToast("Book marked as returned and quantity updated successfully.", "success");
    } catch (error) {
      console.error("Error in handleConfirmReturn:", error.message, error.stack); // Debug log
      showToast(`Failed to mark as returned or update quantity: ${error.message}`, "error");
    } finally {
      showConfirmModal.value = false;
      returnId.value = null;
    }
  }

  function handleShow(item) {
    selectedBook.value = item;
    showBookDetail.value = true;
  }

  function openUpdateModal(item) {
    updateForm.value.id = item?.id || null;
    updateForm.value.user_name = item?.user?.name || item?.borrower_name || "";
    updateForm.value.email_borrower = item?.user?.email || item?.borrower_email || "";
    updateForm.value.book_name = item?.book?.title || item?.book_name || "";
    updateForm.value.return_date = item?.return_date || "";
    updateForm.value.status = item?.status || "return";
    showUpdateModal.value = true;
  }

  function closeUpdateModal() {
    showUpdateModal.value = false;
    formError.value = "";
  }

  function confirmReturn(id) {
    returnId.value = id;
    showConfirmModal.value = true;
  }

  return {
    borrowData,
    booksData,
    search,
    limit,
    currentPage,
    selectedStatus,
    selectedCategory,
    showModal,
    showBookDetail,
    showUpdateModal,
    showConfirmModal,
    openDropdown,
    selectedBook,
    addForm,
    updateForm,
    statusOptions,
    formError,
    message,
    messageType,
    returnId,
    categories,
    filteredBorrowData,
    totalFilteredItems,
    totalPages,
    borrowedCount,
    returnedCount,
    overdueCount,
    getItemStatus,
    getDaysLeft,
    formatDate,
    toggleDropdown,
    fetchBorrowData,
    fetchBooksData,
    getBook,
    handleShow,
    openUpdateModal,
    closeUpdateModal,
    submitUpdate,
    submitAddBorrow,
    handleDelete,
    confirmReturn,
    handleConfirmReturn,
    showToast,
  };
}