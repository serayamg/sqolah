import { User, StudentProfile, AuditLog } from '../types/intelligence';

const STORAGE_KEY_USERS = 'sqolah_users_v1';
const STORAGE_KEY_CURRENT_USER = 'sqolah_current_user_v1';
const STORAGE_KEY_STUDENTS = 'sqolah_students_v1';
const STORAGE_KEY_AUDIT_LOGS = 'sqolah_audit_logs_v1';

// Seed Initial Users
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
    id: 'usr-student-new',
    username: 'siswabaru',
    fullName: 'Ahmad Fauzi (Siswa Baru)',
    email: 'siswa.baru@sqolah.id',
    role: 'student',
    status: 'active',
    createdAt: '2026-09-01T08:00:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-student-budi',
    username: 'budisantoso',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@sqolah.id',
    role: 'student',
    status: 'active',
    createdAt: '2026-07-15T09:30:00Z',
    lastLoginAt: new Date().toISOString()
  }
];

// Seed Initial Student Profiles
const SEED_PROFILES: StudentProfile[] = [
  {
    id: 'prof-student-new',
    userId: 'usr-student-new',
    studentId: 'SQ-2026-0099',
    fullName: 'Ahmad Fauzi',
    nickname: 'Fauzi',
    phone: '0812-3456-7890',
    email: 'siswa.baru@sqolah.id',
    school: 'SMA Negeri 1 Jakarta',
    grade: 10,
    level: 'SMA',
    curriculum: 'Kurikulum Merdeka',
    academicYear: '2026/2027',
    city: 'Jakarta Selatan',
    program: 'Reguler Bimbel SMA',
    batch: 'Gelombang 2 - 2026',
    startDate: '2026-09-01',
    parentName: 'Bambang Sudiro',
    parentPhone: '0811-9876-5432',
    assignedSubjectIds: ['sma-kimia-10'],
    onboardingCompleted: false,
    currentOnboardingStep: 1,
    diagnosticCompleted: false
  },
  {
    id: 'prof-student-budi',
    userId: 'usr-student-budi',
    studentId: 'SQ-2026-0042',
    fullName: 'Budi Santoso',
    nickname: 'Budi',
    phone: '0813-8899-1122',
    email: 'budi.santoso@sqolah.id',
    school: 'SMA Negeri 8 Jakarta',
    grade: 10,
    level: 'SMA',
    curriculum: 'Kurikulum Merdeka',
    academicYear: '2026/2027',
    city: 'Jakarta Pusat',
    program: 'Intensif UTBK / SNBT & Prestasi',
    batch: 'Gelombang 1 - 2026',
    startDate: '2026-07-15',
    parentName: 'Hendra Santoso',
    parentPhone: '0812-7766-5544',
    assignedSubjectIds: ['sma-kimia-10'],
    onboardingCompleted: true,
    currentOnboardingStep: 5,
    diagnosticCompleted: true
  }
];

// Seed Audit Logs
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    who: 'admin@sqolah.id',
    what: 'Student Registration & Subject Assignment',
    targetUserId: 'usr-student-budi',
    targetUserName: 'Budi Santoso',
    when: '2026-07-15T09:30:00Z',
    oldValue: 'Unregistered',
    newValue: 'SQ-2026-0042 | Kurikulum Merdeka | Kimia SMA'
  },
  {
    id: 'audit-2',
    who: 'admin@sqolah.id',
    what: 'Program Assignment',
    targetUserId: 'usr-student-budi',
    targetUserName: 'Budi Santoso',
    when: '2026-08-01T14:15:00Z',
    oldValue: 'Reguler Bimbel SMA',
    newValue: 'Intensif UTBK / SNBT & Prestasi'
  },
  {
    id: 'audit-3',
    who: 'admin@sqolah.id',
    what: 'New Student Registration',
    targetUserId: 'usr-student-new',
    targetUserName: 'Ahmad Fauzi',
    when: '2026-09-01T08:00:00Z',
    oldValue: 'None',
    newValue: 'SQ-2026-0099 | Reguler Bimbel SMA | Kimia SMA'
  }
];

export class AuthService {
  private static initStorage(): void {
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
      // Default to Budi Santoso so user can immediately see rich intelligent dashboard,
      // or switch to Ahmad Fauzi (New Student) / Admin with the top switcher
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(SEED_USERS[2]));
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
      return user || SEED_USERS[2];
    } catch {
      return SEED_USERS[2];
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
