import { ref, computed, provide } from "vue";
import {
  getBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
} from "@/services/Api/borrow";
import { getBooks, updateBook } from "@/services/Api/book";
import { getAllUsers } from "@/services/Api/user";
import { exportToExcel } from "@/utils/exportToExcel";
import { exportToPDF } from "@/utils/exportToPDF";

export function useBorrowManagement() {
  const borrowData = ref([]);
  const booksData = ref([]);
  const usersData = ref([]);
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
    user_barcode: "",
    user_id: "",
    books: [{ isbn: "", book_name: "", return_date: "" }],
    librarian_name: "",
    date_borrow: "",
    status: "borrowed",
  });

  const updateForm = ref({
    id: null,
    user_name: "",
    borrower_email: "",
    book_name: "",
    return_date: "",
    status: "",
    books: [],
  });

  const statusOptions = ref([
    { value: "borrowed", label: "Borrowing" },
    { value: "returned", label: "Returned" },
  ]);

  provide("borrowManagement", {
    getBook,
    getUser,
    showToast,
    fetchBooksData,
    fetchUsersData,
    booksData,
    usersData,
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
      filtered = filtered.filter((item) => getItemStatus(item) === "returned").length;
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
    }, 5000);
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
      } else if (type === "barcode") {
        book = booksData.value.find((b) => b.barcode === identifier.trim());
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

  async function fetchUsersData() {
    try {
      loading.value = true;
      const response = await getAllUsers();
      console.log("Raw API response for getAllUsers:", response);
      usersData.value = Array.isArray(response.data.users) ? response.data.users : [];
      console.log("Users fetched:", usersData.value);
      if (!usersData.value.length) {
        showToast("No users available in the database.", "error");
      }
    } catch (err) {
      console.error("Error fetching users:", err.message, err.stack);
      showToast("Failed to load user data. Please check your connection or database.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function getUser(barcode) {
    try {
      if (!barcode) throw new Error("User barcode is missing or invalid");
      console.log(`Looking for user with barcode: ${barcode}`);
      const normalizedBarcode = barcode.trim();
      let user = usersData.value.find((u) => u.barcode === normalizedBarcode);
      if (!user) {
        user = usersData.value.find((u) => u.id === normalizedBarcode);
      }
      if (!user) {
        throw new Error(`User not found for barcode: ${barcode}`);
      }
      console.log("User found:", user);
      return user;
    } catch (error) {
      console.error("Error in getUser:", error.message, error.stack);
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
    if (formData.borrowerType === "new") {
      if (!formData.borrower_name?.trim() || !formData.borrower_email?.trim() || !formData.date_borrow)
        throw new Error("Borrower name, email, and borrow date are required for new users.");
    } else {
      if (!formData.user_barcode?.trim() || !formData.date_borrow)
        throw new Error("User barcode and borrow date are required for existing users.");
      if (!formData.user_id)
        throw new Error("Valid user ID is required for existing users.");
      const user = await getUser(formData.user_barcode);
      if (!user) throw new Error(`User with barcode ${formData.user_barcode} not found.`);
      formData.user_name = user.username || user.name;
      formData.user_id = user.id;
    }
    if (!formData.librarian_name?.trim()) throw new Error("Librarian name is required.");
    if (!formData.books || formData.books.length === 0) throw new Error("At least one book is required.");
    if (formData.books.length > 3) throw new Error("Cannot borrow more than three books at a time.");

    for (const book of formData.books) {
      if (!book.isbn?.trim()) throw new Error("Book ISBN is required.");
      const normalizedIsbn = book.isbn.replace(/[-\s]/g, '');
      if (!/^(?:\d{10}|\d{13})$/.test(normalizedIsbn)) throw new Error(`Invalid ISBN: ${book.isbn}`);
      if (!book.date_return) throw new Error("Book return date is required.");
      if (!book.name?.trim()) throw new Error("Book name is required.");

      const foundBook = await getBook(normalizedIsbn, "isbn");
      if (!foundBook) throw new Error(`Book not found for ISBN ${book.isbn}.`);
      const newQuantity = foundBook.quantity - (formData.quantity || 1);
      if (newQuantity < 0) {
        throw new Error(`Book "${book.name}" has insufficient stock (available: ${foundBook.quantity}).`);
      }
    }

    loading.value = true;
    error.value = null;
    try {
      const payload = {
        is_new_user: formData.borrowerType === "new",
        borrower_name: formData.borrowerType === "new" ? formData.borrower_name : undefined,
        user_name: formData.borrowerType === "existing" ? formData.user_name : undefined,
        borrower_email: formData.borrowerType === "new" ? formData.borrower_email : undefined,
        user_id: formData.user_id || undefined,
        librarian_name: formData.librarian_name,
        date_borrow: formData.date_borrow,
        books: formData.books.map((book) => ({
          name: book.name,
          isbn: book.isbn,
          date_return: book.date_return,
        })),
        quantity: formData.quantity || 1,
        status: formData.status,
      };
      const response = await createBorrow(payload);
      console.log(`createBorrow response at ${now}:`, JSON.stringify(response, null, 2));

      if (!response || !response.data) {
        throw new Error("Invalid or empty response from createBorrow API.");
      }
      if (response.status && response.status >= 400) {
        const errorMsg = response.data?.message || `API error (status ${response.status})`;
        console.error(`createBorrow failed with status ${response.status}:`, response.data);
        throw new Error(errorMsg);
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
        user_barcode: "",
        user_id: "",
        books: [{ isbn: "", book_name: "", return_date: "" }],
        librarian_name: "",
        date_borrow: "",
        status: "borrowed",
      };
      showModal.value = false;
      showToast("Borrow record created successfully.", "success");
      return response;
    } catch (err) {
      console.error(`Error in createBorrow or updateBook at ${now}:`, err.message, err.response || err);
      throw err;
    }
  } catch (err) {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
    console.error(`submitAddBorrow error at ${now}:`, err.message, err.response || err);
    const errorMessage = err.response?.data?.message || err.message || "Failed to create borrow record.";
    error.value = errorMessage;
    showToast(errorMessage, "error");
    throw err;
  } finally {
    loading.value = false;
  }
}
  async function submitUpdate(formData) {
    try {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
      console.log(`Received formData in submitUpdate at ${now}:`, JSON.stringify(formData, null, 2));

      if (!formData.id) throw new Error("Borrow record ID is missing.");
      if (!formData.return_date) throw new Error("Return date is required.");
      if (!formData.status) throw new Error("Status is required.");

      const borrowRecord = borrowData.value.find((item) => item.id === formData.id);
      if (!borrowRecord) throw new Error(`Borrow record with ID ${formData.id} not found in local data.`);

      let updatedBooks = [];
      if (formData.status === "returned" && borrowRecord.status !== "returned") {
        for (const book of borrowRecord.books || []) {
          const foundBook = await getBook(book.isbn, "isbn");
          if (foundBook) {
            const newQuantity = foundBook.quantity + (formData.quantity || 1);
            console.log(`Updating book ID ${foundBook.id} with payload:`, { quantity: newQuantity });
            try {
              const updateResponse = await updateBook(foundBook.id, { quantity: newQuantity });
              console.log(`updateBook response for ID ${foundBook.id}:`, JSON.stringify(updateResponse, null, 2));
              updatedBooks.push({ id: foundBook.id, quantity: foundBook.quantity });
            } catch (updateErr) {
              console.error(`Error updating book ID ${foundBook.id}:`, updateErr.response || updateErr);
              throw new Error(`Failed to update book "${foundBook.title || book.name}": ${updateErr.response?.data?.message || updateErr.message}`);
            }
          }
        }
      }

      const payload = {
        return_date: formData.return_date,
        status: formData.status,
        books: formData.books || borrowRecord.books,
      };
      console.log(`Update payload to /borrow/:id at ${now}:`, JSON.stringify(payload, null, 2));
      const response = await updateBorrow(formData.id, payload);
      console.log(`updateBorrow response at ${now}:`, JSON.stringify(response, null, 2));

      if (!response || !response.data) {
        throw new Error("Invalid or empty response from updateBorrow API.");
      }
      if (response.status && response.status >= 400) {
        const errorMsg = response.data?.message || `API error (status ${response.status})`;
        console.error(`updateBorrow failed with status ${response.status}:`, response.data);
        throw new Error(errorMsg);
      }

      showUpdateModal.value = false;
      formError.value = "";
      await fetchBorrowData();
      await fetchBooksData();
      showToast("Borrow record updated successfully", "success");
      return response;
    } catch (err) {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
      console.error(`submitUpdate error at ${now}:`, err.message, err.response || err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update borrow record.";
      formError.value = errorMessage;
      showToast(`Update failed: ${errorMessage}`, "error");
      throw err;
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
    if (borrowRecord.status === "returned") {
      throw new Error(`Borrow record with ID ${returnId.value} is already marked as returned`);
    }

    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
    console.log(`Returning borrow record with ID: ${returnId.value} at ${now}`);
    console.log("Borrow record structure:", JSON.stringify(borrowRecord, null, 2));
    console.log("Current books data:", JSON.stringify(booksData.value, null, 2));

    const updateBorrowPayload = {
      status: "returned",
      return_date: new Date().toISOString().slice(0, 10),
    };
    console.log(`Attempting to update borrow record ID: ${returnId.value} with payload:`, JSON.stringify(updateBorrowPayload, null, 2));

    // Update borrow record
    const borrowResponse = await updateBorrow(returnId.value, updateBorrowPayload);
    console.log(`updateBorrow response:`, JSON.stringify(borrowResponse, null, 2));

    if (!borrowResponse || !borrowResponse.data) {
      throw new Error("Invalid or empty response from updateBorrow API");
    }
    if (borrowResponse.status && borrowResponse.status >= 400) {
      throw new Error(`API error (status ${borrowResponse.status}): ${borrowResponse.data?.message || "Unknown error"}`);
    }

    // Update book quantities
    const booksToUpdate = borrowRecord.books || (borrowRecord.book ? [borrowRecord.book] : []);
    if (booksToUpdate.length === 0) {
      console.warn(`Borrow record with ID ${returnId.value} has no books to update.`);
      showToast("No books to update. Borrow record marked as returned.", "warning");
    } else {
      const updatedBooks = [];
      for (const bookItem of booksToUpdate) {
        let foundBook = null;
        let identifierType = "isbn";
        let identifier = bookItem.isbn || bookItem.book?.isbn;

        if (!identifier) {
          identifier = bookItem.title || bookItem.book?.title;
          identifierType = "title";
          if (!identifier) {
            console.warn(`Book item in borrow record ID ${returnId.value} missing both ISBN and title. Skipping.`, JSON.stringify(bookItem, null, 2));
            showToast("Book missing ISBN and title. Skipping quantity update.", "warning");
            continue;
          }
        }

        try {
          foundBook = await getBook(identifier, identifierType);
          if (!foundBook) {
            console.warn(`Book with ${identifierType} ${identifier} not found. Skipping quantity update.`);
            showToast(`Book with ${identifierType} ${identifier} not found. Skipping quantity update.`, "warning");
            continue;
          }
        } catch (error) {
          console.warn(`Error retrieving book with ${identifierType} ${identifier}: ${error.message}`);
          showToast(`Failed to retrieve book with ${identifierType} ${identifier}. Skipping quantity update.`, "warning");
          continue;
        }

        const quantityToReturn = bookItem.quantity || borrowRecord.quantity || 1;
        const updatedQuantity = foundBook.quantity + quantityToReturn;
        const updatedAvailable = foundBook.available + quantityToReturn;
        console.log(`Book ID ${foundBook.id} current state:`, JSON.stringify(foundBook, null, 2));

        let updateBookPayload = { quantity: updatedQuantity, available: updatedAvailable };
        console.log(`Attempting to update book ID: ${foundBook.id} (${identifierType}: ${identifier}, Title: ${foundBook.title}) with payload:`, JSON.stringify(updateBookPayload, null, 2));

        try {
          let bookResponse = await updateBook(foundBook.id, updateBookPayload);
          console.log(`updateBook response for ID ${foundBook.id}:`, JSON.stringify(bookResponse, null, 2));

          if (!bookResponse || !bookResponse.data) {
            throw new Error(`Invalid or empty response from updateBook API for book ID ${foundBook.id}`);
          }
          if (bookResponse.status && bookResponse.status >= 400) {
            console.warn(`Failed to update book ID ${foundBook.id}. Skipping book update.`);
            showToast(`Warning: Could not update book "${foundBook.title}" (quantity to ${updatedQuantity}, available to ${updatedAvailable}). Borrow record updated, but book needs manual adjustment.`, "warning");
            console.log(`Manual action required: Run 'UPDATE books SET quantity = ${updatedQuantity}, available = ${updatedAvailable} WHERE id = ${foundBook.id};' in the database.`);
            continue;
          }
          updatedBooks.push({ id: foundBook.id, originalQuantity: foundBook.quantity, originalAvailable: foundBook.available });
          console.log(`Successfully updated book ${foundBook.title}. New quantity: ${updatedQuantity}, available: ${updatedAvailable}`);
        } catch (bookError) {
          console.error(`Failed to update book ID ${foundBook.id}:`, bookError.response || bookError);
          showToast(`Warning: Could not update book "${foundBook.title}" (quantity to ${updatedQuantity}, available to ${updatedAvailable}). Borrow record updated, but book needs manual adjustment.`, "warning");
          console.log(`Manual action required: Run 'UPDATE books SET quantity = ${updatedQuantity}, available = ${updatedAvailable} WHERE id = ${foundBook.id};' in the database.`);
          continue;
        }
      }
    }

    await fetchBorrowData();
    await fetchBooksData();
    showToast("Book(s) marked as returned successfully. Check warnings for any book quantity issues.", "success");
  } catch (error) {
    console.error("Error in handleConfirmReturn:", error.message, error.stack);
    showToast(`Failed to mark as returned: ${error.message}`, "error");
  } finally {
    showConfirmModal.value = false;
    returnId.value = null;
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
    updateForm.value.status = item?.status || "borrowed";
    updateForm.value.books = item?.books || (item?.book ? [item.book] : []);
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
    usersData,
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
    getUser,
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
    fetchUsersData,
  };
}