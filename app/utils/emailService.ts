/**
 * Email Service for Kawempe Muslim SS
 * This service handles sending automated notifications for admissions and portal access.
 * Note: Actual implementation would require integration with an email provider like Resend, SendGrid, or AWS SES.
 */

// Placeholder for SendGrid/Resend/etc.
const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
    // In a real implementation, you would call your email API here.
    return { success: true, messageId: Math.random().toString(36).substring(7) };
};

export const sendPortalReminderEmail = async (parent: any) => {
    return await sendEmail({
        to: parent.parent_email,
        subject: "Action Required: Complete Your Portal Setup - Kawempe Muslim SS",
        html: `<p>Dear ${parent.parent_name}, please log in to the portal for ${parent.student_name}.</p>`
    });
};

export const sendBulkPortalReminders = async (parents: any[]) => {
    const results = await Promise.all(parents.map(p => sendPortalReminderEmail(p)));
    return { totalSent: results.length, successes: results.filter(r => r.success).length };
};

export const sendApplicationApprovalEmail = async (app: any, regNo: string) => {
    return await sendEmail({
        to: app.parent_email,
        subject: "Application Approved - Kawempe Muslim SS",
        html: `
            <h1>Congratulations!</h1>
            <p>Dear ${app.parent_name},</p>
            <p>We are pleased to inform you that the application for <strong>${app.student_name}</strong> has been approved.</p>
            <p>Student Registration Number: <strong>${regNo}</strong></p>
            <p>Please visit the school office or log in to the portal for further instructions.</p>
        `
    });
};

export const sendApplicationRejectionEmail = async (app: any) => {
    return await sendEmail({
        to: app.parent_email,
        subject: "Application Update - Kawempe Muslim SS",
        html: `
            <p>Dear ${app.parent_name},</p>
            <p>Thank you for your interest in Kawempe Muslim SS. We regret to inform you that we are unable to offer a place for ${app.student_name} at this time.</p>
        `
    });
};
