/**
 * FEEDBACK SYSTEM USAGE GUIDE
 * =============================
 * Comprehensive guide for implementing modals, toasts, and alerts
 */

// ============================================================================
// 1. TOAST/ALERT NOTIFICATIONS (Floating notifications at top-right)
// ============================================================================

import { useFeedback } from "@/context/FeedbackContext";

function MyComponent() {
    const { success, error, warning, info } = useFeedback();

    const handleSave = async () => {
        try {
            // ... save logic
            success("Berhasil! Data telah disimpan."); // Auto-hides after 5s
        } catch (err) {
            error("Gagal menyimpan data");
        }
    };

    return <button onClick={handleSave}>Save</button>;
}

// ============================================================================
// 2. CONFIRMATION MODALS (Center overlay)
// ============================================================================

function DeleteProductButton() {
    const { showConfirmation, success } = useFeedback();

    const handleDelete = () => {
        showConfirmation({
            title: "Hapus Produk?",
            message: "Produk yang dihapus tidak dapat dikembalikan.",
            confirmText: "Hapus",
            isDangerous: true,
            onConfirm: async () => {
                try {
                    // ... delete logic
                    success("Produk berhasil dihapus");
                } catch (err) {
                    error("Gagal menghapus produk");
                }
            },
        });
    };

    return <button onClick={handleDelete}>Delete</button>;
}

// Usage in logout:
function LogoutButton() {
    const { showConfirmation } = useFeedback();
    const navigate = useNavigate();

    const handleLogout = () => {
        showConfirmation({
            title: "Konfirmasi Logout",
            message: "Anda akan keluar dari sesi ini.",
            confirmText: "Keluar",
            cancelText: "Batal",
            isDangerous: false,
            onConfirm: async () => {
                // ... logout API call
                navigate("/login");
            },
        });
    };

    return <button onClick={handleLogout}>Logout</button>;
}

// ============================================================================
// 3. REJECTION MODAL (With textarea input)
// ============================================================================

function RejectApplicantButton({ applicantId }) {
    const { showRejection, success, error } = useFeedback();

    const handleReject = () => {
        showRejection({
            title: "Tolak Pendaftaran",
            message:
                "Berikan alasan penolakan untuk dikirim ke email pendaftar.",
            onSubmit: async (reason) => {
                try {
                    // API call to reject applicant
                    await rejectApplicant(applicantId, reason);
                    success("Pendaftaran berhasil ditolak");
                } catch (err) {
                    error("Gagal menolak pendaftaran");
                }
            },
        });
    };

    return <button onClick={handleReject}>Reject</button>;
}

// ============================================================================
// 4. SUCCESS MODALS (Center card with icon)
// ============================================================================

function RegisterForm() {
    const { showSuccess } = useFeedback();
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            // ... register logic
            showSuccess({
                title: "Pendaftaran Berhasil!",
                message:
                    "Data Anda terkirim. Tunggu verifikasi Admin via email.",
                actionText: "Kembali ke Login",
                onAction: () => {
                    navigate("/login");
                },
            });
        } catch (err) {
            // error handling
        }
    };

    return null;
}

// ============================================================================
// 5. DIRECT COMPONENT IMPORTS (Alternative method without context)
// ============================================================================

import {
    ConfirmationModal,
    RejectionModal,
    SuccessModal,
    ApplicantDetailModal,
} from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Toast";

function DirectComponentUsage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Konfirmasi"
                message="Apakah Anda yakin?"
                confirmText="Ya"
                cancelText="Tidak"
                isDangerous={false}
                onConfirm={() => {
                    // Handle confirmation
                    setShowModal(false);
                }}
            />

            <Alert
                type="success"
                message="Berhasil! Data telah disimpan."
                onClose={() => {}}
            />

            <Alert
                type="error"
                title="Gagal"
                message="Terjadi kesalahan saat menyimpan."
            />
        </>
    );
}

// ============================================================================
// 6. INLINE ALERTS (Form validation)
// ============================================================================

import { Alert } from "@/components/ui/Toast";

function RegistrationForm() {
    const [errors, setErrors] = useState({});

    const handleSubmit = (data) => {
        const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
    };

    return (
        <div>
            {errors.general && (
                <Alert
                    type="error"
                    title="Data Tidak Lengkap"
                    message="Harap isi semua field wajib (*)."
                    onClose={() => setErrors({})}
                />
            )}

            {errors.email && (
                <Alert
                    type="warning"
                    title="Data Duplikat"
                    message="Email sudah digunakan."
                />
            )}
        </div>
    );
}

// ============================================================================
// 7. APPLICANT DETAIL MODAL
// ============================================================================

function ApplicantDetailView({ applicantId }) {
    const [showModal, setShowModal] = useState(false);
    const { success, error } = useFeedback();
    const [applicant, setApplicant] = useState(null);

    const mockApplicant = {
        id: 1,
        sellerName: "Budi Santoso",
        storeName: "Toko Elektronik Budi",
        ktpImage: "https://via.placeholder.com/300x200?text=KTP",
        photoImage: "https://via.placeholder.com/300x200?text=Foto+Diri",
    };

    return (
        <>
            <button onClick={() => setShowModal(true)}>View Details</button>

            <ApplicantDetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                applicant={mockApplicant}
                onApprove={async (id) => {
                    try {
                        // API call to approve
                        success("Penjual berhasil diaktifkan");
                        setShowModal(false);
                    } catch (err) {
                        error("Gagal mengaktifkan penjual");
                    }
                }}
                onReject={(id) => {
                    // Implement rejection flow
                    console.log("Reject:", id);
                }}
            />
        </>
    );
}

// ============================================================================
// COMPONENT PROPS REFERENCE
// ============================================================================

/**
 * Toast Types: 'success' | 'error' | 'warning' | 'info'
 * Duration: milliseconds (default 5000)
 *
 * useFeedback().success(message, duration)
 * useFeedback().error(message, duration)
 * useFeedback().warning(message, duration)
 * useFeedback().info(message, duration)
 */

/**
 * ConfirmationModal Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string
 * - message: string
 * - confirmText: string
 * - cancelText: string
 * - isDangerous: boolean (red button if true, purple if false)
 * - isLoading: boolean
 * - onConfirm: () => void
 */

/**
 * RejectionModal Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string
 * - message: string
 * - isLoading: boolean
 * - onSubmit: (reason: string) => void
 */

/**
 * SuccessModal Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string
 * - message: string
 * - actionText: string
 * - onAction: () => void
 */

/**
 * ApplicantDetailModal Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - applicant: {
 *     id: number,
 *     sellerName: string,
 *     storeName: string,
 *     ktpImage: string,
 *     photoImage: string
 *   }
 * - onApprove: (id: number) => void
 * - onReject: (id: number) => void
 * - isLoading: boolean
 */

/**
 * Alert Props:
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - title: string (optional)
 * - message: string
 * - onClose: () => void (optional)
 */

// ============================================================================
// STYLING GUIDE
// ============================================================================

/**
 * PRIMARY COLOR: Purple (#A435F0)
 * SUCCESS: Green (#198754)
 * ERROR: Red (#DC3545)
 * WARNING: Yellow (#E59819)
 * INFO: Blue (#0D6EFD)
 *
 * Typography: Inter font
 * Border Radius: rounded-lg (8px)
 * Shadows:
 *   - Normal: shadow (0 1px 3px)
 *   - Modal: shadow-2xl (heavy shadow)
 */

export default {};
