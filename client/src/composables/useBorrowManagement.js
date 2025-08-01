import { ref, computed, provide } from "vue";
import {
  getBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
} from "@/services/Api/borrow";
import { getBooks, updateBook } from "@/services/Api/book";
import { exportToExcel } from "@/utils/exportToExcel";
import { exportToPDF } from "@/utils/exportToPDF";

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
    borrower_name: "",
    borrower_email: "",
    user_id: "",
    books: [{ isbn: "", book_name: "", return_date: "" }],
    librarian_name: "",
    date_borrow: "",
    status: "borrowed",
  });

  const updateForm = ref({
    id: null,
    user_name: "",
    book_name: "",
    return_date: "",
    status: "",
  });

  const statusOptions = ref([
    { value: "borrowed", label: "Borrowing" },
    { value: "returned", label: "Returned" },
  ]);

  provide("borrowManagement", {
    getBook,
    showToast,
    fetchBooksData,
    booksData,
  });

  const categories = computed(() => {
    const set = new Set(borrowData.value.map((item) => item.book.category));
    return Array.from(set).map((name, index) => ({ id: index + 1, name }));
  });

  const borrowedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "borrowed").length;
  });
  const returnedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "returned").length;
  });
  const overdueCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "overdue").length;
  });

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

  async function fetchBooksData() {
    try {
      loading.value = true;
      const response = await getBooks();
      console.log("Raw API response for getBooks:", response);
      booksData.value = Array.isArray(response.data.books) ? response.data.books : [];
      console.log("Books fetched:", booksData.value);
      if (!booksData.value.length) {
        showToast("No books available in the database. Please add books to continue.", "error");
      }
    } catch (err) {
      console.error("Error fetching books:", err.message, err.stack);
      showToast("Failed to load book data. Please check your connection or database.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function getBook(identifier, type = "isbn") {
    try {
      if (!identifier) throw new Error(`${type.toUpperCase()} is missing or invalid`);
      console.log(`Looking for book with ${type}: ${identifier}`);
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
      console.error("Error in getBook:", error.message, error.stack);
      return null;
    }
  }

  async function fetchBorrowData() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getBorrows();
      console.log("Raw API response for getBorrows:", response);
      borrowData.value = response.data;
      console.log("Borrow data fetched:", borrowData.value);
    } catch (err) {
      console.error("Error fetching borrow data:", err.message, err.stack);
      error.value = "Failed to load borrow records.";
      showToast("Failed to load borrow records.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function submitAddBorrow(formData) {
  try {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
    console.log(`Received formData in submitAddBorrow at ${now}:`, JSON.stringify(formData, null, 2));

    if (!formData) throw new Error("No form data provided.");
    if (formData.is_new_user) {
      if (!formData.borrower_name || !formData.borrower_email || !formData.date_borrow)
        throw new Error("User name, email, and borrow date are required for new users.");
    } else if (!formData.user_id || !formData.date_borrow)
      throw new Error("User ID and borrow date are required for existing users.");
    if (!formData.librarian_name) throw new Error("Librarian name is required.");
    if (!formData.books || formData.books.length === 0) throw new Error("At least one book is required.");
    if (formData.books.length > 3) throw new Error("Cannot borrow more than three books at a time.");
    for (const book of formData.books) {
      if (!book.isbn) throw new Error("Book ISBN is required.");
      if (!/^\d{10}$|^\d{13}$/.test(book.isbn)) throw new Error(`Invalid ISBN: ${book.isbn}`);
      if (!book.date_return) throw new Error("Book return date is required.");
      if (!book.name) throw new Error("Book name is required.");

      const foundBook = await getBook(book.isbn, "isbn");
      if (!foundBook) throw new Error(`Book not found for ISBN ${book.isbn}.`);

      // ✅ Condition 1: If only one copy left, block borrowing
      if (foundBook.quantity <= 1) {
        throw new Error(`Book "${book.name}" has only one and cannot be borrowed.`);
      }

      if (foundBook.quantity < (formData.quantity || 1)) {
        throw new Error(`Book "${book.name}" has insufficient stock (available: ${foundBook.quantity}).`);
      }
    }

    loading.value = true;
    error.value = null;

    const responses = [];
    const updatedBooks = [];
    try {
      const payload = {
        is_new_user: formData.is_new_user,
        borrower_name: formData.borrower_name,
        borrower_email: formData.borrower_email,
        user_id: formData.user_id,
        librarian_name: formData.librarian_name,
        date_borrow: formData.date_borrow,
        books: formData.books,
        quantity: formData.quantity || 1,
        status: formData.status,
      };

      console.log(`Sending payload to createBorrow at ${now}:`, JSON.stringify(payload, null, 2));
      const response = await createBorrow(payload);
      console.log(`createBorrow response at ${now}:`, JSON.stringify(response, null, 2));
      if (!response || (response.status && response.status >= 400)) {
        throw new Error(response?.data?.message || "Failed to create borrow records");
      }
      responses.push(response);

      for (const book of formData.books) {
        const foundBook = await getBook(book.isbn, "isbn");
        if (foundBook) {
          await updateBook(foundBook.id, { quantity: foundBook.quantity - (formData.quantity || 1) });
          updatedBooks.push({ id: foundBook.id, quantity: foundBook.quantity });
        }
      }
    } catch (err) {
      for (const book of updatedBooks) {
        await updateBook(book.id, { quantity: book.quantity });
      }
      throw err;
    }

    selectedCategory.value = "";
    selectedStatus.value = "";
    search.value = "";
    currentPage.value = 1;
    await fetchBorrowData();
    await fetchBooksData();
    addForm.value = {
      borrowerType: "new",
      borrower_name: "",
      borrower_email: "",
      user_id: "",
      books: [{ isbn: "", book_name: "", return_date: "" }],
      librarian_name: "",
      date_borrow: "",
      status: "borrowed",
    };
    showModal.value = false;
    showToast("Borrow record(s) created successfully.", "success");
    return responses;
  } catch (err) {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
    console.error(`submitAddBorrow error at ${now}:`, err.message, err.response?.data || err);
    error.value = err.message || "Failed to create borrow records.";
    showToast(error.value, "error");
    return [];
  } finally {
    loading.value = false;
  }
}

  async function submitUpdate(formData) {
  try {
    console.log("Received formData in submitUpdate:", JSON.stringify(formData, null, 2));
    if (!formData.id) {
      throw new Error("Borrow record ID is missing.");
    }
    if (!formData.return_date) {
      throw new Error("Return date is required.");
    }
    if (!formData.status) {
      throw new Error("Status is required.");
    }

    // Verify borrow record exists locally
    const borrowRecord = borrowData.value.find((item) => item.id === formData.id);
    if (!borrowRecord) {
      throw new Error(`Borrow record with ID ${formData.id} not found in local data.`);
    }
    console.log("Found borrow record:", JSON.stringify(borrowRecord, null, 2));

    const payload = {
      return_date: formData.return_date,
      status: formData.status,
    };
    console.log("Update payload to /borrow/:id:", JSON.stringify(payload, null, 2));
    const response = await updateBorrow(formData.id, payload);
    console.log("updateBorrow response:", JSON.stringify(response, null, 2));
    showUpdateModal.value = false;
    formError.value = "";
    await fetchBorrowData();
    showToast("Borrow record updated successfully", "success");
  } catch (err) {
    console.error("Update error:", err.message, err.response?.data || err);
    const errorMessage = err.response?.data?.message || err.message || "Failed to update borrow record.";
    formError.value = errorMessage;
    showToast(`Update failed: ${errorMessage}`, "error");
    throw new Error(errorMessage);
  }
}
  async function handleDelete(id) {
    try {
      if (!id) throw new Error("No ID provided for deletion");
      console.log("Deleting borrow record with ID:", id);
      await deleteBorrow(id);
      await fetchBorrowData();
      showToast("Borrow record deleted.", "success");
    } catch (err) {
      console.error("Delete error:", err.message);
      showToast("Failed to delete: " + err.message, "error");
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
      console.log("Returning borrow record:", borrowRecord);
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
      console.error("Error in handleConfirmReturn:", error.message, error.stack);
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
    updateForm.value.borrower_email = item?.user?.email || item?.borrower_email || "";
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

function exportBorrowDataToExcel() {
  if (!borrowData.value.length) {
    showToast("No borrow data to export", "error");
    return;
  }
  const flatData = borrowData.value.map((item) => ({
    ID: item.id,
    "Book Title": item.book.title,
    "Book Author": item.book.author,
    "Book Category": item.book.category,
    "User Name": item.user.name,
    "User Email": item.user.email,
    Quantity: item.borrowed_quantity,
    Status: item.status,
    "Borrow Date": item.borrow_date,
    "Return Date": item.return_date,
    "Librarian Name": item.librarian.name,
  }));
  exportToExcel(flatData, "BorrowRecords");
}
function exportBorrowDataToPDF() {
  if (!borrowData.value.length) {
    showToast("No borrow data to export", "error");
    return;
  }
  const flatData = borrowData.value.map((item) => ({
    "Book Title": item.book.title,
    "Book Author": item.book.author,
    "Book Category": item.book.category,
    "User Name": item.user.name,
    "User Email": item.user.email,
    Quantity: item.borrowed_quantity,
    Status: item.status,
    "Borrow Date": item.borrow_date,
    "Return Date": item.return_date,
    "Librarian Name": item.librarian.name,
  }));
  exportToPDF(flatData, "BorrowRecords.pdf");
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
    exportBorrowDataToExcel,
    exportBorrowDataToPDF,
  };
}