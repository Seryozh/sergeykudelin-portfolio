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
    ListFlowable,
    ListItem,
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
    fontSize=28,
    leading=29,
    textColor=INK,
    spaceAfter=4,
)
role_style = ParagraphStyle(
    "Role",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=12,
    leading=15,
    textColor=CORAL,
    spaceAfter=8,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.2,
    leading=10,
    textColor=MUTED,
)
summary_style = ParagraphStyle(
    "Summary",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=9.8,
    leading=13.2,
    textColor=INK,
    spaceBefore=11,
    spaceAfter=8,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=8.4,
    leading=10,
    textColor=MUTED,
    tracking=1.3,
    spaceBefore=8,
    spaceAfter=6,
)
job_style = ParagraphStyle(
    "Job",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=11.2,
    leading=13,
    textColor=INK,
)
date_style = ParagraphStyle(
    "Date",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.5,
    leading=10,
    textColor=MUTED,
    alignment=TA_RIGHT,
)
company_style = ParagraphStyle(
    "Company",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.7,
    leading=10.5,
    textColor=MUTED,
    spaceAfter=5,
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.75,
    leading=11.6,
    textColor=INK,
    leftIndent=0,
    firstLineIndent=0,
)
small_style = ParagraphStyle(
    "Small",
    parent=styles["Normal"],
    fontName=FONT_REGULAR,
    fontSize=8.55,
    leading=11,
    textColor=INK,
)


def section_title(text):
    return [
        Paragraph(text.upper(), section_style),
        HRFlowable(width="100%", thickness=0.6, color=LINE, spaceAfter=7),
    ]


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(item, bullet_style), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        bulletFontName=FONT_REGULAR,
        bulletFontSize=5.5,
        bulletColor=CORAL,
        leftIndent=12,
        bulletOffsetY=1.6,
        spaceAfter=4,
    )


def job(title, company, dates, description, items):
    header = Table(
        [[Paragraph(f"{title} / {company}", job_style), Paragraph(dates, date_style)]],
        colWidths=[5.2 * inch, 1.8 * inch],
        hAlign="LEFT",
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BASELINE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
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
    topMargin=0.48 * inch,
    bottomMargin=0.43 * inch,
    title="Sergey Kudelin - Growth Engineer Resume",
    author="Sergey Kudelin",
    subject="Growth Engineer resume",
)

story = [
    Paragraph("Sergey Kudelin", name_style),
    Paragraph("Growth Engineer / Miami, FL", role_style),
    Paragraph(
        '<link href="mailto:kudelin.dev@gmail.com" color="#5E625B">kudelin.dev@gmail.com</link>'
        '  /  <link href="https://sergeykudelin.com" color="#5E625B">sergeykudelin.com</link>'
        '  /  <link href="https://www.linkedin.com/in/sergeykudelin" color="#5E625B">linkedin.com/in/sergeykudelin</link>'
        '  /  <link href="https://github.com/Seryozh" color="#5E625B">github.com/Seryozh</link>',
        contact_style,
    ),
    Paragraph(
        "I build products and the GTM systems around them for early-stage teams. "
        "Currently contracting with Fyxed after working directly with FutureClinic's founder.",
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
                "Build a source-backed market intelligence system that reads property-manager websites for payment signals and traces each useful account to a verified decision-maker.",
                "Turn repeated repair-funding signals from customer calls into a PM-branded owner workflow, with the product surface and case tooling needed to test the idea safely.",
                "Built the operating layer behind Fyxed's early outbound motion, which produced the company's first outbound-booked meeting and moved warm outreach toward text after email underperformed.",
            ],
        ),
        Spacer(1, 7),
        job(
            "GTM Engineer",
            "FutureClinic, YC F24",
            "Contract / Mar to May 2026",
            "Digital clinics and creator tools for physicians.",
            [
                "Built the first working version of FutureClinic Creators, including the backend and AI pipeline, then worked with another engineer to take it into production. The product is live today.",
                "Built personalized Doctor Preview Pages and the internal review and publishing workflow behind them, including individualized founder-video generation for physician creators.",
                "Built Nikola, a human-approved AI agent that researched doctors and prepared personalized Gmail drafts while keeping every outbound action behind review.",
            ],
        ),
    ]
)

story.extend(section_title("Skills"))
story.extend(
    [
        Paragraph(
            "<b>Engineering</b>  TypeScript, Python, SQL, React, Next.js, FastAPI, Postgres, Supabase, Redis",
            small_style,
        ),
        Spacer(1, 3),
        Paragraph(
            "<b>AI systems</b>  Claude Agent SDK, OpenRouter, tool calling, human approval, state machines, audit logs",
            small_style,
        ),
        Spacer(1, 3),
        Paragraph(
            "<b>Growth systems</b>  Enrichment, source verification, CRM design, campaign orchestration, deliverability",
            small_style,
        ),
    ]
)

story.extend(section_title("Education"))
education = Table(
    [[Paragraph("<b>Computer Science</b> / Florida International University", small_style), Paragraph("Miami, FL", date_style)]],
    colWidths=[5.7 * inch, 1.3 * inch],
)
education.setStyle(
    TableStyle(
        [
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("VALIGN", (0, 0), (-1, -1), "BASELINE"),
        ]
    )
)
story.append(education)

doc.build(story)
print(OUTPUT)
