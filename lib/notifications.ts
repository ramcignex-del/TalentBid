// Mock notification system (console.log)
// In production, replace with actual email service

export async function sendNewBidNotification(data: {
  candidateEmail: string
  candidateName: string
  companyName: string
  roleTitle: string
  salaryOffer: number
}) {
  console.log('\n📧 EMAIL NOTIFICATION - New Bid Received')
  console.log('==========================')
  console.log(`To: ${data.candidateEmail}`)
  console.log(`Subject: New Bid from ${data.companyName}`)
  console.log(`\nHi ${data.candidateName},`)
  console.log(`\nYou have received a new bid from ${data.companyName}!`)
  console.log(`\nRole: ${data.roleTitle}`)
  console.log(`Salary Offer: $${data.salaryOffer.toLocaleString()}`)
  console.log(`\nLog in to your dashboard to view details and respond.`)
  console.log('==========================\n')
}

export async function sendNonCompetitiveBidNotification(data: {
  employerEmail: string
  companyName: string
  candidateName: string
  roleTitle: string
}) {
  console.log('\n📧 EMAIL NOTIFICATION - Non-Competitive Bid')
  console.log('==========================')
  console.log(`To: ${data.employerEmail}`)
  console.log(`Subject: Bid Update - Non-Competitive`)
  console.log(`\nHi ${data.companyName} Team,`)
  console.log(`\nYour bid for ${data.candidateName} (${data.roleTitle}) is currently not competitive.`)
  console.log(`\nConsider revising your offer to improve your chances.`)
  console.log('==========================\n')
}

export async function sendBidAcceptedNotification(data: {
  employerEmail: string
  companyName: string
  candidateName: string
  roleTitle: string
}) {
  console.log('\n📧 EMAIL NOTIFICATION - Bid Accepted!')
  console.log('==========================')
  console.log(`To: ${data.employerEmail}`)
  console.log(`Subject: 🎉 ${data.candidateName} Accepted Your Bid!`)
  console.log(`\nHi ${data.companyName} Team,`)
  console.log(`\nGreat news! ${data.candidateName} has accepted your bid for the ${data.roleTitle} position.`)
  console.log(`\nLog in to your dashboard to proceed with next steps.`)
  console.log('==========================\n')
}

export async function sendBidRejectedNotification(data: {
  employerEmail: string
  companyName: string
  candidateName: string
  roleTitle: string
}) {
  console.log('\n📧 EMAIL NOTIFICATION - Bid Status Update')
  console.log('==========================')
  console.log(`To: ${data.employerEmail}`)
  console.log(`Subject: Bid Update for ${data.roleTitle}`)
  console.log(`\nHi ${data.companyName} Team,`)
  console.log(`\n${data.candidateName} has declined your bid for the ${data.roleTitle} position.`)
  console.log(`\nWe encourage you to explore other talented candidates on TalentBid.`)
  console.log('==========================\n')
}
