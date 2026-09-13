import { User, StudentProfile, AuditLog } from '../types/intelligence';

const STORAGE_KEY_USERS = 'sqolah_users_v4';
const STORAGE_KEY_CURRENT_USER = 'sqolah_current_user_v4';
const STORAGE_KEY_STUDENTS = 'sqolah_students_v4';
const STORAGE_KEY_AUDIT_LOGS = 'sqolah_audit_logs_v4';

// Seed Users: Only 1 Student (M Elang El Haqeem) and 1 Super Admin
const SEED_USERS: User[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    fullName: 'Super Administrator Sqolah',
    email: 'admin@sqolah.id',
    role: 'superadmin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-student-elang',
    username: 'elangelhaqeem',
    fullName: 'M Elang El Haqeem',
    email: 'elang.elhaqeem@sqolah.id',
    role: 'student',
    status: 'active',
    createdAt: '2026-07-15T09:30:00Z',
    lastLoginAt: new Date().toISOString()
  }
];

// Seed Student Profile: Only 1 Student (M Elang El Haqeem, Kelas XI SMA)
const SEED_PROFILES: StudentProfile[] = [
  {
    id: 'prof-student-elang',
    userId: 'usr-student-elang',
    studentId: 'SQ-2026-0001',
    fullName: 'M Elang El Haqeem',
    nickname: 'Elang',
    phone: '0812-3456-7890',
    email: 'elang.elhaqeem@sqolah.id',
    school: 'SMA Negeri 1',
    grade: 11,
    level: 'SMA',
    curriculum: 'Kurikulum Merdeka',
    academicYear: '2026/2027',
    city: 'Jakarta',
    program: 'Intensif UTBK / SNBT & Prestasi SMA',
    batch: 'Gelombang 1 - 2026',
    startDate: '2026-07-15',
    parentName: 'Wali Murid',
    parentPhone: '0811-2233-4455',
    assignedSubjectIds: ['sma-kimia-10'],
    onboardingCompleted: true,
    currentOnboardingStep: 5,
    diagnosticCompleted: true
  }
];

// Seed Audit Logs referencing M Elang El Haqeem
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    who: 'admin@sqolah.id',
    what: 'Student Registration & Subject Assignment',
    targetUserId: 'usr-student-elang',
    targetUserName: 'M Elang El Haqeem',
    when: '2026-07-15T09:30:00Z',
    oldValue: 'Unregistered',
    newValue: 'SQ-2026-0001 | Kelas XI SMA | Kurikulum Merdeka | Kimia SMA'
  },
  {
    id: 'audit-2',
    who: 'admin@sqolah.id',
    what: 'Program Assignment',
    targetUserId: 'usr-student-elang',
    targetUserName: 'M Elang El Haqeem',
    when: '2026-08-01T14:15:00Z',
    oldValue: 'Reguler Bimbel SMA',
    newValue: 'Intensif UTBK / SNBT & Prestasi SMA'
  }
];

export class AuthService {
  private static initStorage(): void {
    // Clean up older version keys if present
    ['sqolah_users_v1', 'sqolah_users_v2', 'sqolah_users_v3',
     'sqolah_students_v1', 'sqolah_students_v2', 'sqolah_students_v3',
     'sqolah_audit_logs_v1', 'sqolah_audit_logs_v2', 'sqolah_audit_logs_v3',
     'sqolah_current_user_v1', 'sqolah_current_user_v2', 'sqolah_current_user_v3'].forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });

    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(SEED_PROFILES));
    }
    if (!localStorage.getItem(STORAGE_KEY_AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
      // Default to M Elang El Haqeem (Student, Kelas XI SMA)
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(SEED_USERS[1]));
    }
  }

  public static getUsers(): User[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    } catch {
      return SEED_USERS;
    }
  }

  public static getCurrentUser(): User {
    this.initStorage();
    try {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_USER) || 'null');
      return user || SEED_USERS[1];
    } catch {
      return SEED_USERS[1];
    }
  }

  public static setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }

  public static switchUser(userId: string): User {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId) || users[0];
    this.setCurrentUser(target);
    return target;
  }

  public static getStudentProfiles(): StudentProfile[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]');
    } catch {
      return SEED_PROFILES;
    }
  }

  public static getStudentProfileByUserId(userId: string): StudentProfile | null {
    const profiles = this.getStudentProfiles();
    return profiles.find(p => p.userId === userId) || null;
  }

  public static saveStudentProfile(profile: StudentProfile): void {
    const profiles = this.getStudentProfiles();
    const index = profiles.findIndex(p => p.id === profile.id || p.userId === profile.userId);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(profiles));
  }

  public static updateStudentByAdmin(
    updatedProfile: StudentProfile,
    actionDesc: string,
    oldValStr: string,
    newValStr: string,
    adminEmail: string = 'admin@sqolah.id'
  ): void {
    this.saveStudentProfile(updatedProfile);

    // Record audit log
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      who: adminEmail,
      what: actionDesc,
      targetUserId: updatedProfile.userId,
      targetUserName: updatedProfile.fullName,
      when: new Date().toISOString(),
      oldValue: oldValStr,
      newValue: newValStr
    };
    this.addAuditLog(newLog);
  }

  public static getAuditLogs(): AuditLog[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT_LOGS) || '[]');
    } catch {
      return SEED_AUDIT_LOGS;
    }
  }

  public static addAuditLog(log: AuditLog): void {
    const logs = this.getAuditLogs();
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(logs));
  }

  public static resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_AUDIT_LOGS);
    this.initStorage();
  }
}
