<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-800">User Management</h2>
            <button @click="openDialog"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
            </button>
        </div>

        <!-- Users Table -->
        <div class="bg-white border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-50 text-left">
                    <tr>
                        <th class="px-4 py-3 font-medium text-gray-600">ID</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Profile</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Email</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Phone</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Role</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Birthday</th>
                        <th class="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-600">{{ user.id }}</td>
                        <td class="px-4 py-3">
                            <div class="flex items-center space-x-3">
                                <img :src="user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                                    " class="w-9 h-9 rounded-full border object-cover" alt="Avatar" />
                                <span class="font-medium text-gray-900">{{ user.name }}</span>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-gray-700">{{ user.email }}</td>
                        <td class="px-4 py-3 text-gray-700">{{ user.phone || '-' }}</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-gray-600">{{ user.birthday || '-' }}</td>
                        <td class="px-4 py-3 text-right">
                            <div class="relative inline-block text-left">
                                <button @click="toggleActionMenu(user.id)" aria-label="Actions menu">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600"
                                        fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                    </svg>
                                </button>
                                <div v-if="activeActionMenu === user.id"
                                    class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1">
                                    <button @click="viewUser(user)"
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        View
                                    </button>
                                    <button @click="editUser(user)"
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Edit
                                    </button>
                                    <button @click="deleteUser(user.id)"
                                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add/Edit User Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
                <form @submit.prevent="submitUser" class="space-y-3">
                    <input v-model="newUser.name" type="text" placeholder="Name" class="w-full p-2 border rounded"
                        required />
                    <input v-model="newUser.email" type="email" placeholder="Email" class="w-full p-2 border rounded"
                        required />
                    <input v-model="newUser.password" type="password" placeholder="Password"
                        class="w-full p-2 border rounded" :required="!isEditing" />
                    <input v-model="newUser.phone" type="text" placeholder="Phone" class="w-full p-2 border rounded" />
                    <select v-model="newUser.role" class="w-full p-2 border rounded" required>
                        <option disabled value="">Select role</option>
                        <option value="librarian">Librarian</option>
                        <option value="borrower">Borrower</option>
                    </select>

                    <input v-model="newUser.birthday" type="date" class="w-full p-2 border rounded" />

                    <input type="file" accept="image/*" @change="handleAvatarUpload"
                        class="w-full p-2 border rounded" />
                    <div v-if="newUser.avatar" class="mt-2 flex justify-center">
                        <img :src="newUser.avatar" alt="Avatar Preview"
                            class="w-24 h-24 rounded-full object-cover border" />
                    </div>

                    <div class="flex justify-end gap-2 mt-4">
                        <button @click="closeDialog" type="button" class="px-4 py-2 bg-gray-200 rounded">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {{ isEditing ? 'Update' : 'Add' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- View User Modal -->
        <div v-if="showViewModal"
            class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-800 tracking-tight">
                        User Profile
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">Complete user information</p>
                </div>

                <!-- Content -->
                <div class="px-8 py-6">
                    <!-- User Avatar & Basic Info -->
                    <div class="flex items-start space-x-6 mb-8">
                        <div class="relative">
                            <img :src="viewedUser.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    viewedUser.name
                                )}&background=4f46e5&color=ffffff&size=80`
                                " alt="User Avatar"
                                class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100" />
                            <div
                                class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full">
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-2xl font-bold text-gray-900 mb-1">{{ viewedUser.name }}</h4>
                            <p class="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">
                                {{ viewedUser.role }}
                            </p>
                            <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="viewedUser.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                ">
                                <div class="w-2 h-2 rounded-full mr-2" :class="viewedUser.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                    "></div>
                                {{ viewedUser.status }}
                            </div>
                        </div>
                    </div>

                    <!-- User Details Grid -->
                    <div class="grid grid-cols-1 gap-6">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email
                                    Address</span>
                                <span class="text-gray-900 font-medium">{{ viewedUser.email }}</span>
                            </div>

                            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone
                                    Number</span>
                                <span class="text-gray-900 font-medium">{{ viewedUser.phone || 'Not provided' }}</span>
                            </div>

                            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                <span
                                    class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Birthday</span>
                                <span class="text-gray-900 font-medium">{{ viewedUser.birthday || 'Not provided'
                                }}</span>
                            </div>

                            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                                <span class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Member
                                    Since</span>
                                <span class="text-gray-900 font-medium">{{ viewedUser.joinDate || 'Not provided'
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
                    <button @click="showViewModal = false"
                        class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Close
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="users.length === 0" class="text-center py-12 text-gray-500">
            No users found.
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const users = ref([])
const showAddModal = ref(false)
const showViewModal = ref(false)
const activeActionMenu = ref(null)
const viewedUser = ref(null)

const isEditing = ref(false)
const editingUserId = ref(null)

const newUser = ref({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    bio: '',
    birthday: '',
    avatar: '',
    password: ''
})

// Load users from localStorage on mount
onMounted(() => {
    const stored = localStorage.getItem('users')
    if (stored) {
        users.value = JSON.parse(stored)
    }
})

// Save to localStorage on change
watch(
    users,
    (newVal) => {
        localStorage.setItem('users', JSON.stringify(newVal))
    },
    { deep: true }
)

function openDialog() {
    showAddModal.value = true
    isEditing.value = false
    editingUserId.value = null
    newUser.value = {
        name: '',
        email: '',
        phone: '',
        role: '',
        status: 'active',
        bio: '',
        birthday: '',
        avatar: ''
    }
    activeActionMenu.value = null
}

function closeDialog() {
    showAddModal.value = false
    isEditing.value = false
    editingUserId.value = null
    newUser.value = {
        name: '',
        email: '',
        phone: '',
        role: '',
        status: 'active',
        bio: '',
        birthday: '',
        avatar: ''
    }
}

function handleAvatarUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        newUser.value.avatar = reader.result
    }
    reader.readAsDataURL(file)
}

function submitUser() {
    if (isEditing.value) {
        // Update existing user
        const index = users.value.findIndex((u) => u.id === editingUserId.value)
        if (index !== -1) {
            users.value[index] = {
                ...users.value[index],
                name: newUser.value.name,
                email: newUser.value.email,
                phone: newUser.value.phone || '',
                role: newUser.value.role || 'User',
                status: newUser.value.status,
                avatar: newUser.value.avatar,
                bio: newUser.value.bio,
                birthday: newUser.value.birthday,
                password: newUser.value.password || users.value[index].password
            }
        }


    } else {
        // Add new user
        const newId = users.value.length ? Math.max(...users.value.map((u) => u.id)) + 1 : 1
        const joined = new Date().toISOString().split('T')[0]

        users.value.push({
            id: newId,
            name: newUser.value.name,
            email: newUser.value.email,
            phone: newUser.value.phone || '',
            role: newUser.value.role || 'User',
            status: newUser.value.status,
            joinDate: joined,
            avatar: newUser.value.avatar,
            bio: newUser.value.bio,
            birthday: newUser.value.birthday,
            password: newUser.value.password
        });

    }

    closeDialog()
}

function toggleActionMenu(id) {
    activeActionMenu.value = activeActionMenu.value === id ? null : id
}

function viewUser(user) {
    viewedUser.value = user
    showViewModal.value = true
    activeActionMenu.value = null
}

function editUser(user) {
    isEditing.value = true
    editingUserId.value = user.id
    newUser.value = { ...user }
    showAddModal.value = true
    activeActionMenu.value = null
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.value = users.value.filter((user) => user.id !== id)
    }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.tracking-tight {
    letter-spacing: -0.025em;
}

.tracking-wide {
    letter-spacing: 0.025em;
}
</style>
