from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "sergey-kudelin-resume.pdf"

INK = colors.HexColor("#191B18")
MUTED = colors.HexColor("#5E625B")
LINE = colors.HexColor("#C9CCC5")
CORAL = colors.HexColor("#D43D23")

FONT_REGULAR = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

for candidate, name in [
    (Path("/System/Library/Fonts/SFNS.ttf"), "PortfolioSans"),
    (Path("/System/Library/Fonts/Supplemental/Arial.ttf"), "PortfolioSans"),
]:
    if candidate.exists():
        try:
            pdfmetrics.registerFont(TTFont(name, str(candidate)))
            FONT_REGULAR = name
            break
        except Exception:
            pass

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=30,
    leading=32,
    textColor=INK,
    spaceAfter=5,
)
role_style = ParagraphStyle(
    "Role",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=12.5,
    leading=16,
    textColor=CORAL,
    spaceAfter=10,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.6,
    leading=11.2,
    textColor=MUTED,
)
summary_style = ParagraphStyle(
    "Summary",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=10.4,
    leading=14.5,
    textColor=INK,
    spaceBefore=14,
    spaceAfter=12,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=8.7,
    leading=11,
    textColor=MUTED,
    tracking=1.3,
    spaceBefore=17,
    spaceAfter=7,
)
job_style = ParagraphStyle(
    "Job",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=11.7,
    leading=14.5,
    textColor=INK,
)
date_style = ParagraphStyle(
    "Date",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.9,
    leading=11,
    textColor=MUTED,
    alignment=TA_RIGHT,
)
company_style = ParagraphStyle(
    "Company",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=9.1,
    leading=12,
    textColor=MUTED,
    spaceAfter=7,
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=9.4,
    leading=13.6,
    textColor=INK,
    leftIndent=0,
    firstLineIndent=0,
)
bullet_mark_style = ParagraphStyle(
    "BulletMark",
    parent=bullet_style,
    fontName="Helvetica-Bold",
    fontSize=9.4,
    leading=13.6,
    textColor=CORAL,
)
small_style = ParagraphStyle(
    "Small",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=9.3,
    leading=13,
    textColor=INK,
)
skill_label_style = ParagraphStyle(
    "SkillLabel",
    parent=small_style,
    fontName=FONT_BOLD,
    fontSize=8.8,
    leading=11.6,
)
skill_text_style = ParagraphStyle(
    "SkillText",
    parent=small_style,
    fontSize=8.8,
    leading=11.6,
)


def section_title(text):
    return [
        Paragraph(text.upper(), section_style),
        HRFlowable(width="100%", thickness=0.6, color=LINE, spaceAfter=11),
    ]


def bullets(items):
    rows = [[Paragraph("&#8226;", bullet_mark_style), Paragraph(item, bullet_style)] for item in items]
    table = Table(
        rows,
        colWidths=[0.17 * inch, 6.83 * inch],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -2), 5),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 0),
            ]
        )
    )
    table.spaceAfter = 8
    return table


def job(title, company, dates, description, items):
    header = Table(
        [[Paragraph(f"{title} / {company}", job_style), Paragraph(dates, date_style)]],
        colWidths=[5.2 * inch, 1.8 * inch],
        hAlign="LEFT",
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (1, 0), (1, -1), 2.8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return KeepTogether(
        [
            header,
            Paragraph(description, company_style),
            bullets(items),
        ]
    )


doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=letter,
    rightMargin=0.56 * inch,
    leftMargin=0.56 * inch,
    topMargin=0.58 * inch,
    bottomMargin=0.55 * inch,
    title="Sergey Kudelin - Growth Engineer Resume",
    author="Sergey Kudelin",
    subject="Growth Engineer resume",
)

story = [
    Paragraph("Sergey Kudelin", name_style),
    Paragraph("Growth Engineer / Miami, FL", role_style),
    Paragraph(
        '<link href="mailto:sergey@sergeykudelin.com" color="#5E625B">sergey@sergeykudelin.com</link>'
        '  /  <link href="https://sergeykudelin.com" color="#5E625B">sergeykudelin.com</link>'
        '  /  <link href="https://www.linkedin.com/in/sergeykudelin" color="#5E625B">linkedin.com/in/sergeykudelin</link>'
        '  /  <link href="https://github.com/Seryozh" color="#5E625B">github.com/Seryozh</link>',
        contact_style,
    ),
    Paragraph(
        "I got into FutureClinic by building them a working doctor-discovery system before I "
        "had the job. Now I am the Growth Engineer at Fyxed, where I build the systems it uses "
        "to find and prove demand.",
        summary_style,
    ),
]

story.extend(section_title("Experience"))
story.extend(
    [
        job(
            "Growth Engineer",
            "Fyxed",
            "Contract / Jun 2026 to present",
            "Fintech for residential property managers.",
            [
                "Built and now operate the system Fyxed uses to find property managers already signaling an owner-payment problem, with the source evidence and decision-maker attached.",
                "Built and now run Fyxed's PM-branded owner workflow for a live repair-funding case, including private intake and internal review.",
                "Built Fyxed's first outbound stack across CRM architecture, enrichment, sequencing, and channel testing. The founder used it to book the company's first outbound meeting.",
            ],
        ),
        Spacer(1, 16),
        job(
            "GTM Engineer",
            "FutureClinic, YC F24",
            "Contract / Mar to May 2026",
            "Digital clinics and creator tools for physicians.",
            [
                "Built the first working version of FutureClinic Creators myself, including its backend and AI pipeline, then worked with another engineer to take it into production. It is live today.",
                "Built Doctor Preview Pages and the internal review and publishing workflow behind them, giving each physician creator a custom clinic page and founder video made specifically for them.",
                "Built Nikola, an AI outreach agent in Slack that researched physician creators and created personalized Gmail drafts only after human approval.",
            ],
        ),
    ]
)

story.extend(section_title("Skills & tools"))
skills = Table(
    [
        [Paragraph("Languages & web", skill_label_style), Paragraph("TypeScript, JavaScript, Python, SQL, HTML/CSS, React, Next.js, Node.js, FastAPI, Express", skill_text_style)],
        [Paragraph("Data & infra", skill_label_style), Paragraph("Postgres, Supabase, Redis, Drizzle, BullMQ, Modal, Vercel, GitHub, REST APIs, webhooks", skill_text_style)],
        [Paragraph("AI & agents", skill_label_style), Paragraph("Claude, Codex, Claude Agent SDK, OpenRouter, Gemini, GPT-4o, LangGraph, human approval", skill_text_style)],
        [Paragraph("GTM & research", skill_label_style), Paragraph("Clay, Apollo, Exa Agent API, Firecrawl, Apify, Hunter, Snov, NPI Registry, YouTube Data API", skill_text_style)],
        [Paragraph("CRM & outbound", skill_label_style), Paragraph("Twenty CRM, Instantly, Smartlead, Airtable, Slack, Gmail, Resend, Twilio Lookup, OpenPhone, Google Drive", skill_text_style)],
    ],
    colWidths=[1.15 * inch, 5.85 * inch],
    hAlign="LEFT",
)
skills.setStyle(
    TableStyle(
        [
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -2), 5),
            ("BOTTOMPADDING", (0, -1), (-1, -1), 0),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]
    )
)
story.append(skills)

story.extend(section_title("Creator background"))
story.append(
    Paragraph(
        "Built and ran a Roblox YouTube channel before entering startups. That work trained my instincts for audience research, idea selection, scripts, thumbnails, and keeping content specific to the creator.",
        small_style,
    )
)

story.extend(section_title("Education"))
story.append(Paragraph("<b>Florida International University</b>", small_style))

doc.build(story)
print(OUTPUT)
