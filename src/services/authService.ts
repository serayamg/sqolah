import { User, StudentProfile, AuditLog } from '../types/intelligence';
import { DatabaseService } from './databaseService';

const KEY_CURRENT_USER_SESSION = 'sqolah_current_user_session';

export class AuthService {
  public static init(): void {
    DatabaseService.initDatabase();
  }

  public static getUsers(): User[] {
    return DatabaseService.getUsers();
  }

  public static getCurrentUser(): User {
    this.init();
    try {
      const session = localStorage.getItem(KEY_CURRENT_USER_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        const exists = DatabaseService.getUserById(parsed.id);
        if (exists) return exists;
      }
    } catch {}

    const users = DatabaseService.getUsers();
    // Default to M Elang El Haqeem (student)
    const elang = users.find(u => u.id === 'usr-student-elang') || users[0];
    this.setCurrentUser(elang);
    return elang;
  }

  public static setCurrentUser(user: User): void {
    localStorage.setItem(KEY_CURRENT_USER_SESSION, JSON.stringify(user));
  }

  public static switchUser(userId: string): User {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId) || users[0];
    this.setCurrentUser(target);
    return target;
  }

  public static getStudentProfiles(): StudentProfile[] {
    return DatabaseService.getStudents();
  }

  public static getStudentProfileByUserId(userId: string): StudentProfile | null {
    const profiles = this.getStudentProfiles();
    return profiles.find(p => p.userId === userId || p.studentId === userId) || null;
  }

  public static saveStudentProfile(profile: StudentProfile): void {
    DatabaseService.updateStudent(profile);
  }

  public static updateStudentByAdmin(
    updatedProfile: StudentProfile,
    actionDesc: string,
    oldValStr: string,
    newValStr: string,
    adminEmail: string = 'admin@sqolah.id'
  ): void {
    DatabaseService.updateStudent(updatedProfile);

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
    DatabaseService.insertAuditLog(newLog);
  }

  public static getAuditLogs(): AuditLog[] {
    return DatabaseService.getAuditLogs();
  }

  public static addAuditLog(log: AuditLog): void {
    DatabaseService.insertAuditLog(log);
  }

  public static resetDemoData(): void {
    DatabaseService.seedEmptyElangDatabase();
    // Set active user back to M Elang El Haqeem
    const users = DatabaseService.getUsers();
    const elang = users.find(u => u.id === 'usr-student-elang') || users[0];
    this.setCurrentUser(elang);
  }
}
