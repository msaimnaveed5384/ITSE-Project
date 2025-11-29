import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import '../css/admin.css';
import { ArrowLeft, Save } from 'lucide-react';

function AddCourse() {
    const { users } = usePage().props;
    const teachers = users.filter(u => u.role === 'teacher');
    
    const [formData, setFormData] = useState({
        name: '',
        credits: '',
        teacher_id: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post('/courses', formData, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            preserveState: false
        });
    };

    return (
        <div className="layout">
            <div className="page-header">
                <div className="header-left">
                    <Link href="/admin-dashboard" className="btn-secondary">
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1>Create New Course</h1>
                </div>
            </div>

            <div className="page-body">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Course Information</h2>
                        <p>Fill in the details to create a new course</p>
                    </div>

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Course Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="Enter course name"
                                required
                            />
                            {errors.name && (
                                <span className="error-message">{errors.name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="credits" className="form-label">
                                Credits *
                            </label>
                            <input
                                type="number"
                                id="credits"
                                name="credits"
                                value={formData.credits}
                                onChange={handleChange}
                                className={`form-input ${errors.credits ? 'error' : ''}`}
                                placeholder="Enter number of credits"
                                min="1"
                                max="10"
                                required
                            />
                            {errors.credits && (
                                <span className="error-message">{errors.credits}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="teacher_id" className="form-label">
                                Assign Teacher *
                            </label>
                            <select
                                id="teacher_id"
                                name="teacher_id"
                                value={formData.teacher_id}
                                onChange={handleChange}
                                className={`form-input ${errors.teacher_id ? 'error' : ''}`}
                                required
                            >
                                <option value="">Select a teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.email})
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && (
                                <span className="error-message">{errors.teacher_id}</span>
                            )}
                            {teachers.length === 0 && (
                                <span className="error-message">
                                    No teachers available. Please create a teacher account first.
                                </span>
                            )}
                        </div>

                        <div className="form-actions">
                            <Link 
                                href="/admin-dashboard" 
                                className="btn-secondary"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={isSubmitting || teachers.length === 0}
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Creating...' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="info-card">
                    <h3>About Course Creation</h3>
                    <div className="info-content">
                        <div className="info-item">
                            <strong>Course Name:</strong> Should be descriptive and unique
                        </div>
                        <div className="info-item">
                            <strong>Credits:</strong> Typically between 1-6 credits per course
                        </div>
                        <div className="info-item">
                            <strong>Teacher Assignment:</strong> Each course must be assigned to an available teacher
                        </div>
                        <div className="info-item">
                            <strong>Automatic Fields:</strong> Course ID and timestamps are generated automatically
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCourse;