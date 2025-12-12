import Link from 'next/link'

export default function testPage() {
    return (
        <div>
            <h2>テストページ</h2>
            <Link href="/test/images-upload">test-upload</Link>
        </div>
    )

}